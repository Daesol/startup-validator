import OpenAI from "openai";
import type {
  VCAgentType,
  VCReport,
  ProblemAnalysis,
  MarketAnalysis,
  CompetitiveAnalysis,
  UVPAnalysis,
  BusinessModelAnalysis,
  ValidationAnalysis,
  LegalAnalysis,
  MetricsAnalysis,
} from "@/lib/supabase/types";
import { 
  getProblemAgentPrompt,
  getMarketAgentPrompt,
  getCompetitiveAgentPrompt,
  getUVPAgentPrompt,
  getBusinessModelAgentPrompt,
  getValidationAgentPrompt,
  getLegalAgentPrompt,
  getMetricsAgentPrompt,
  getVCLeadPrompt 
} from "./agent-prompts";

/**
 * IMPORTANT DEPLOYMENT NOTES:
 * 
 * When deploying to Vercel, there are several considerations:
 * 1. Serverless function timeouts (max 60s on hobby, 300s on pro plan)
 * 2. OpenAI API calls might time out or fail due to network issues
 * 3. The validation process needs to continue after sending response to client
 * 
 * This file implements retry logic and proper error handling to ensure
 * the validation process is as reliable as possible in serverless environments.
 * 
 * Configured maxDuration in next.config.mjs should match the Vercel plan limits.
 * 
 * MODEL CHOICE:
 * Using GPT-3.5-turbo instead of GPT-4 models for significantly faster processing
 * and better reliability in serverless environments. This trade-off improves:
 * - Response time (5-10x faster than GPT-4)
 * - Success rate within Vercel timeouts
 * - Overall user experience by providing quicker feedback
 */

// Define constants for environment detection and timeouts
const IS_VERCEL = process.env.VERCEL === '1';
const API_TIMEOUT = IS_VERCEL ? 20000 : 60000; // 20 seconds for Vercel, 60 for other environments

// Enhanced OpenAI client with timeouts and retries for reliability in serverless environments
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: API_TIMEOUT, // Timeout for API requests
  maxRetries: IS_VERCEL ? 2 : 3, // Increase retries
});
console.log("api key", process.env.OPENAI_API_KEY);

// Helper function to handle API calls with retries
async function callOpenAIWithRetry<T>(apiCall: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Retrying OpenAI API call, attempt ${attempt}/${maxRetries}`);
      if (attempt > 0) {
        
        // Exponential backoff with jitter
        const delay = Math.min(1000 * (2 ** attempt) + Math.random() * 1000, 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return await apiCall();
    } catch (error) {
      lastError = error;
      console.error(`OpenAI API error (attempt ${attempt}/${maxRetries}):`, 
        error instanceof Error ? error.message : "Unknown error");
      
      // If we've reached max retries, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  // This should never be reached due to the throw above, but TypeScript needs it
  throw lastError;
}

// Main validation function that coordinates the multi-agent process
export async function runVCValidation(
  businessIdea: string,
  additionalContext: Record<string, any> = {},
  onAgentComplete?: (agentType: VCAgentType, analysis: any) => Promise<void>,
  agentToProcess?: VCAgentType // New parameter to specify which agent to process
): Promise<{
  success: boolean;
  agent_analyses: AgentAnalyses;
  vc_report?: VCReport;
  error?: string;
  error_details?: string;
  failed_at?: string;
  next_agent?: VCAgentType; // New field to indicate the next agent to process
}> {
  console.log(`[VC-VALIDATION] Starting VC validation process ${agentToProcess ? `for agent: ${agentToProcess}` : ''}`);
  console.log(`[VC-VALIDATION] Environment: ${IS_VERCEL ? 'Vercel serverless' : 'Non-Vercel'}`);
  console.log(`[VC-VALIDATION] API Timeout: ${API_TIMEOUT}ms, Max Retries: ${IS_VERCEL ? '2' : '3'}`);
  
  // Combine business idea with additional context
  const context: Record<string, any> = {
    user_input: businessIdea,
    ...additionalContext
  };
    
  // Initialize the analyses object with null values
  const agentAnalyses: AgentAnalyses = {
    problem: null,
    team: null,
    market: null,
    solution: null,
    business: null,
    competitor: null,
    timing: null,
    fundraising: null
  };

  // If we received existing analyses in additionalContext, use those
  if (additionalContext.existing_analyses) {
    Object.assign(agentAnalyses, additionalContext.existing_analyses);
  }

  try {
    // If no specific agent is requested, process the problem agent as the first step
    if (!agentToProcess) {
      agentToProcess = 'problem';
    }

    // Define the agent processing order
    const agentOrder: VCAgentType[] = [
      'problem',
      'market',
      'competitive',
      'uvp',
      'business_model',
      'validation',
      'legal',
      'metrics'
    ];

    // Get the current agent's index and determine the next agent
    const currentIndex = agentOrder.indexOf(agentToProcess);
    const nextAgent = currentIndex < agentOrder.length - 1 ? agentOrder[currentIndex + 1] : null;
    
    // Process the requested agent
    console.log(`[VC-VALIDATION] Processing agent: ${agentToProcess}`);
    
    switch(agentToProcess) {
      case 'problem':
        agentAnalyses.problem = await runProblemAgentAnalysis(context);
        if (onAgentComplete) {
          await onAgentComplete('problem', agentAnalyses.problem);
        }
        break;
      case 'market':
        // Add problem analysis to context if available
        if (agentAnalyses.problem) {
          context.problem_analysis = agentAnalyses.problem;
        }
        agentAnalyses.market = await runMarketAgentAnalysis(context);
        if (onAgentComplete) {
          await onAgentComplete('market', agentAnalyses.market);
        }
        break;
      case 'competitive':
        // Add previous analyses to context if available
        if (agentAnalyses.problem) {
          context.problem_analysis = agentAnalyses.problem;
        }
        if (agentAnalyses.market) {
          context.market_analysis = agentAnalyses.market;
        }
        agentAnalyses.competitor = await runCompetitiveAgentAnalysis(context);
        if (onAgentComplete) {
          await onAgentComplete('competitive', agentAnalyses.competitor);
        }
        break;
      case 'uvp':
        // Update context with all previous analyses
        updateContextWithPreviousAnalyses(context, agentAnalyses);
        const uvpAnalysis = await runUVPAgentAnalysis(context);
        // Store in the appropriate field for later processing
        additionalContext.uvp_analysis = uvpAnalysis;
        if (onAgentComplete) {
          await onAgentComplete('uvp', uvpAnalysis);
        }
        break;
      case 'business_model':
        updateContextWithPreviousAnalyses(context, agentAnalyses);
        const businessModelAnalysis = await runBusinessModelAgentAnalysis(context);
        additionalContext.business_model_analysis = businessModelAnalysis;
        if (onAgentComplete) {
          await onAgentComplete('business_model', businessModelAnalysis);
        }
        break;
      case 'validation':
        updateContextWithPreviousAnalyses(context, agentAnalyses);
        const validationAnalysis = await runValidationAgentAnalysis(context);
        additionalContext.validation_analysis = validationAnalysis;
        if (onAgentComplete) {
          await onAgentComplete('validation', validationAnalysis);
        }
        break;
      case 'legal':
        updateContextWithPreviousAnalyses(context, agentAnalyses);
        const legalAnalysis = await runLegalAgentAnalysis(context);
        additionalContext.legal_analysis = legalAnalysis;
        if (onAgentComplete) {
          await onAgentComplete('legal', legalAnalysis);
        }
        break;
      case 'metrics':
        updateContextWithPreviousAnalyses(context, agentAnalyses);
        const metricsAnalysis = await runMetricsAgentAnalysis(context);
        additionalContext.metrics_analysis = metricsAnalysis;
        if (onAgentComplete) {
          await onAgentComplete('metrics', metricsAnalysis);
        }
        break;
      default:
        console.log(`[VC-VALIDATION] Unknown agent type: ${agentToProcess}`);
    }

    // If this is the last agent, generate a VC report
    let vcReport: VCReport | undefined;
    if (!nextAgent) {
      // Generate a basic report if this is the final agent
      vcReport = generateBasicReport(businessIdea, agentAnalyses, additionalContext);
    }
    
    // Return success with analyses and possibly a report
    return {
      success: true,
      agent_analyses: agentAnalyses,
      vc_report: vcReport,
      next_agent: nextAgent as VCAgentType
    };
    
  } catch (error) {
    console.error(`[VC-VALIDATION] Error in validation process:`, error);
    
    // Return error details
    return {
      success: false,
      agent_analyses: agentAnalyses,
      error: error instanceof Error ? error.message : "Unknown error",
      error_details: error instanceof Error ? error.stack : undefined,
      failed_at: `agent_${agentToProcess}`
    };
  }
}

// Helper function to update context with all previous analyses
function updateContextWithPreviousAnalyses(context: Record<string, any>, agentAnalyses: AgentAnalyses) {
  if (agentAnalyses.problem) {
    context.problem_analysis = agentAnalyses.problem;
  }
  if (agentAnalyses.market) {
    context.market_analysis = agentAnalyses.market;
  }
  if (agentAnalyses.competitor) {
    context.competitive_analysis = agentAnalyses.competitor;
  }
  // Add any other analyses from additionalContext
  if (context.uvp_analysis) {
    context.uvp_analysis = context.uvp_analysis;
  }
  if (context.business_model_analysis) {
    context.business_model_analysis = context.business_model_analysis;
  }
  if (context.validation_analysis) {
    context.validation_analysis = context.validation_analysis;
  }
  if (context.legal_analysis) {
    context.legal_analysis = context.legal_analysis;
  }
}

// Helper function to generate a basic report from all analyses
function generateBasicReport(
  businessIdea: string,
  agentAnalyses: AgentAnalyses,
  additionalContext: Record<string, any>
): VCReport {
  // Extract all analyses including those stored in additionalContext
  const problem = agentAnalyses.problem;
  const market = agentAnalyses.market;
  const competitive = agentAnalyses.competitor;
  const uvp = additionalContext.uvp_analysis;
  const businessModel = additionalContext.business_model_analysis;
  const validation = additionalContext.validation_analysis;
  const legal = additionalContext.legal_analysis;
  const metrics = additionalContext.metrics_analysis;
  
  // Calculate an average score from all available agent scores
  const scores: number[] = [];
  if (problem?.score) scores.push(problem.score);
  if (market?.score) scores.push(market.score);
  if (competitive?.score) scores.push(competitive.score);
  if (uvp?.score) scores.push(uvp.score);
  if (businessModel?.score) scores.push(businessModel.score);
  if (validation?.score) scores.push(validation.score);
  if (legal?.score) scores.push(legal.score);
  if (metrics?.score) scores.push(metrics.score);
  
  const overallScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : 70;
  
  // Extract strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestedActions: string[] = [];
  
  // Add strengths, weaknesses, and actions from each analysis
  [problem, market, competitive, uvp, businessModel, validation, legal, metrics].forEach(analysis => {
    if (!analysis) return;
    
    // Add strengths if available
    if (analysis.strengths && Array.isArray(analysis.strengths)) {
      strengths.push(...analysis.strengths.slice(0, 2));
    }
    
    // Add weaknesses if available
    if (analysis.weaknesses && Array.isArray(analysis.weaknesses)) {
      weaknesses.push(...analysis.weaknesses.slice(0, 2));
    }
    
    // Add actions from various field names
    if (analysis.recommendations && Array.isArray(analysis.recommendations)) {
      suggestedActions.push(...analysis.recommendations.slice(0, 2));
    } else if (analysis.suggested_actions && Array.isArray(analysis.suggested_actions)) {
      suggestedActions.push(...analysis.suggested_actions.slice(0, 2));
    }
  });
  
  // Determine business type
  let businessType = "Startup";
  if (problem?.problem_framing === 'global') {
    businessType = "Social Impact";
  } else if (businessIdea.toLowerCase().includes("saas") || businessIdea.toLowerCase().includes("software")) {
    businessType = "B2B SaaS";
  } else if (businessIdea.toLowerCase().includes("app") || businessIdea.toLowerCase().includes("mobile")) {
    businessType = "Consumer App";
  }
  
  return {
    overall_score: overallScore,
    business_type: businessType,
    weighted_scores: {
      problem: 0.15,
      market: 0.15,
      competitive: 0.15,
      uvp: 0.15,
      business_model: 0.15,
      validation: 0.1,
      legal: 0.05,
      metrics: 0.1
    },
    category_scores: {
      problem: problem?.score || 0,
      market: market?.score || 0,
      competition: competitive?.score || 0,
      value_proposition: uvp?.score || 0,
      business: businessModel?.score || 0,
      validation: validation?.score || 0,
      legal: legal?.score || 0,
      metrics: metrics?.score || 0
    },
    recommendation: "Based on our analysis, this business idea shows potential but requires further validation.",
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    suggested_actions: suggestedActions.slice(0, 5),
    idea_improvements: {
      original_idea: businessIdea,
      improved_idea: problem?.improved_problem_statement || businessIdea,
      problem_statement: problem?.improved_problem_statement || "",
      market_positioning: market?.market_demand || "",
      uvp: uvp?.one_liner || "",
      business_model: businessModel?.revenue_model || ""
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// Individual agent functions
async function runProblemAgentAnalysis(context: Record<string, any>): Promise<ProblemAnalysis> {
  const prompt = getProblemAgentPrompt(context);
  
  // Extract the business idea for logging/debugging
  const businessIdea = context.user_input || "";
  console.log(`[PROBLEM-AGENT] Analyzing business idea (length: ${businessIdea.length}): "${businessIdea.substring(0, 50)}..."`);
  console.log(`[PROBLEM-AGENT] Running full analysis...`);
  
  try {
    // Use our retry helper for more reliable API calls
    console.log(`[PROBLEM-AGENT] Using OpenAI analysis flow with timeout: ${API_TIMEOUT}ms`);
    
    // Create a simplified prompt for faster processing
    const simplifiedPrompt = `
    You are the Problem Specialist Agent. Analyze this business idea:
    
    ${businessIdea}
    
    Return a JSON object with these fields:
    - improved_problem_statement: A clearer statement of the problem (max 500 chars)
    - severity_index: Number 1-10 indicating problem severity
    - problem_framing: Either "global" or "niche"
    - root_causes: Array of 2-3 root causes
    - score: Overall score 1-100
    - reasoning: Brief explanation of your score`;
    
    const response = await callOpenAIWithRetry(() => {
      try { 
        return openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Use faster model
          messages: [
            {
              role: "system",
              content: "You are the Problem Specialist Agent. Extract and clarify the problem from business ideas."
            },
            {
              role: "user",
              content: simplifiedPrompt // Use simplified prompt for faster processing
            }
          ],
          temperature: 0.3, // Lower temperature for more consistent results
          max_tokens: 500, // Limit token count for faster response
          response_format: { type: "json_object" }
        })
      } catch (error){
        console.log("Error", error);
        throw error;
      }
  });
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from Problem Agent");
    }
    
    // Try to parse the response as JSON, with error handling
    try {
      const analysis = JSON.parse(content) as ProblemAnalysis;
      
      // Validate the minimal required fields exist
      if (!analysis.improved_problem_statement) {
        analysis.improved_problem_statement = businessIdea.substring(0, 200);
      }
      if (!analysis.severity_index || typeof analysis.severity_index !== 'number') {
        analysis.severity_index = 5; // Default mid-level severity
      }
      if (!analysis.problem_framing) {
        analysis.problem_framing = 'niche'; // Default to niche framing
      }
      if (!analysis.root_causes || !Array.isArray(analysis.root_causes)) {
        analysis.root_causes = ["Unable to determine root causes"];
      }
      if (!analysis.score || typeof analysis.score !== 'number') {
        analysis.score = 70; // Default reasonable score
      }
      if (!analysis.reasoning) {
        analysis.reasoning = "Analysis completed with default values";
      }
      
      return analysis;
    } catch (parseError: unknown) {
      // If JSON parsing fails, throw a clear error
      const errorMessage = parseError instanceof Error ? parseError.message : "Unknown parsing error";
      console.error("[PROBLEM-AGENT] Returned invalid JSON:", errorMessage);
      console.error("[PROBLEM-AGENT] Response content:", content.substring(0, 500));
      throw new Error(`Problem Agent returned invalid JSON: ${errorMessage}`);
    }
  } catch (error) {
    console.error("[PROBLEM-AGENT] Analysis failed after retries:", error instanceof Error ? error.message : String(error));
    
    // Create a fallback analysis with basic information that matches the ProblemAnalysis interface
    return {
      improved_problem_statement: businessIdea.substring(0, 500),
      severity_index: 5,
      problem_framing: 'niche' as const,
      root_causes: ["Unable to determine due to processing issues"],
      score: 60,
      reasoning: "Auto-generated due to API processing issues"
    };
  }
}

async function runMarketAgentAnalysis(context: Record<string, any>): Promise<MarketAnalysis> {
  const prompt = getMarketAgentPrompt(context);
  
  // Extract the business idea for logging
  const businessIdea = context.user_input || "";
  console.log(`[MARKET-AGENT] Analyzing business (length: ${businessIdea.length}): "${businessIdea.substring(0, 50)}..."`);
  console.log(`[MARKET-AGENT] Running market analysis...`);
  
  try {
    // Create a simplified prompt for faster processing
    const simplifiedPrompt = `
    Business Idea: ${businessIdea}
    
    Enhanced Problem: ${context.problem_analysis?.improved_problem_statement || businessIdea}
    
    Provide a market analysis in JSON format with:
    - tam: Total Addressable Market in USD (reasonable number)
    - sam: Serviceable Addressable Market (reasonable portion of TAM)
    - som: Serviceable Obtainable Market (realistic portion of SAM)
    - growth_rate: Annual market growth rate as a string (e.g., "10-15% annually")
    - market_demand: Brief description of real market demand
    - why_now: Brief explanation of market timing
    - score: Your overall score 1-100
    - reasoning: Brief explanation of your score`;
    
    // Use our retry helper for more reliable API calls
    const response = await callOpenAIWithRetry(() => 
      openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are the Market Specialist Agent. Analyze market size and demand for business ideas."
          },
          {
            role: "user",
            content: simplifiedPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      })
    );
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from Market Agent");
    }
    
    // Try to parse the response as JSON, with error handling
    try {
      const analysis = JSON.parse(content) as MarketAnalysis;
      
      // Validate the minimal required fields exist
      if (typeof analysis.tam !== 'number' || isNaN(analysis.tam)) {
        analysis.tam = 1000000000; // Default $1B
      }
      if (typeof analysis.sam !== 'number' || isNaN(analysis.sam)) {
        analysis.sam = analysis.tam * 0.3; // Default 30% of TAM
      }
      if (typeof analysis.som !== 'number' || isNaN(analysis.som)) {
        analysis.som = analysis.sam * 0.1; // Default 10% of SAM
      }
      if (!analysis.growth_rate) {
        analysis.growth_rate = "10-15% annually";
      }
      if (!analysis.market_demand) {
        analysis.market_demand = "Moderate demand with growing interest";
      }
      if (!analysis.why_now) {
        analysis.why_now = "Current market conditions are favorable for this solution";
      }
      if (!analysis.score || typeof analysis.score !== 'number') {
        analysis.score = 70; // Default reasonable score
      }
      if (!analysis.reasoning) {
        analysis.reasoning = "Market analysis completed with default values";
      }
      
      return analysis;
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : "Unknown parsing error";
      console.error("[MARKET-AGENT] Returned invalid JSON:", errorMessage);
      console.error("[MARKET-AGENT] Response content:", content.substring(0, 500));
      throw new Error(`Market Agent returned invalid JSON: ${errorMessage}`);
    }
  } catch (error) {
    console.error("[MARKET-AGENT] Analysis failed after retries:", error instanceof Error ? error.message : String(error));
    
    // Create a fallback analysis
    return {
      tam: 1000000000,
      sam: 300000000,
      som: 30000000,
      growth_rate: "10-15% annually",
      market_demand: "Unable to determine due to processing issues",
      why_now: "Current market conditions",
      score: 60,
      reasoning: "Auto-generated due to API processing issues"
    };
  }
}

async function runCompetitiveAgentAnalysis(context: Record<string, any>): Promise<CompetitiveAnalysis> {
  const prompt = getCompetitiveAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are the Competitive Specialist Agent (The Moat Evaluator). Your role is to identify competitors and evaluate the competitive advantage or moat of the business idea."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Competitive Agent");
  }
  
  return JSON.parse(content) as CompetitiveAnalysis;
}

async function runUVPAgentAnalysis(context: Record<string, any>): Promise<UVPAnalysis> {
  const prompt = getUVPAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are the UVP Specialist Agent (The Message Refiner). Your role is to craft a clear, compelling unique value proposition for the business idea."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from UVP Agent");
  }
  
  return JSON.parse(content) as UVPAnalysis;
}

async function runBusinessModelAgentAnalysis(context: Record<string, any>): Promise<BusinessModelAnalysis> {
  const prompt = getBusinessModelAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are the Business Model Specialist Agent (The Monetization Analyst). Your role is to analyze and improve the revenue model and business sustainability."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Business Model Agent");
  }
  
  return JSON.parse(content) as BusinessModelAnalysis;
}

async function runValidationAgentAnalysis(context: Record<string, any>): Promise<ValidationAnalysis> {
  const prompt = getValidationAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are the Validation Specialist Agent (The Signal Seeker). Your role is to assess current validation efforts and recommend further validation strategies."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Validation Agent");
  }
  
  return JSON.parse(content) as ValidationAnalysis;
}

async function runLegalAgentAnalysis(context: Record<string, any>): Promise<LegalAnalysis> {
  const prompt = getLegalAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are the Legal Specialist Agent (The Compliance Evaluator). Your role is to identify legal, ethical, and regulatory risks in the business idea."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Legal Agent");
  }
  
  return JSON.parse(content) as LegalAnalysis;
}

async function runMetricsAgentAnalysis(context: Record<string, any>): Promise<MetricsAnalysis> {
  const prompt = getMetricsAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are the Strategic Metrics Specialist Agent (The Quantifier). Your role is to provide key strategic metrics and forecasts for the business idea."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Metrics Agent");
  }
  
  return JSON.parse(content) as MetricsAnalysis;
}

async function runVCLeadSynthesis(
  context: Record<string, any>,
  agentAnalyses: Record<VCAgentType, any>
): Promise<VCReport> {
  const prompt = getVCLeadPrompt(context, agentAnalyses);
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are the VC Lead Agent, responsible for synthesizing all specialist analyses into a comprehensive VC-style report with dynamic weighting based on the nature of the idea."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.5,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from VC Lead Agent");
  }
  
  return JSON.parse(content) as VCReport;
}

// Helper function to determine business type and appropriate weightings
export function determineBusinessTypeAndWeights(
  context: Record<string, any>,
  agentAnalyses: Record<VCAgentType, any>
): {
  businessType: string;
  weights: Record<VCAgentType, number>;
} {
  // Extract signals from analyses to infer business type
  const problemAnalysis = agentAnalyses.problem as ProblemAnalysis;
  const marketAnalysis = agentAnalyses.market as MarketAnalysis;
  const competitiveAnalysis = agentAnalyses.competitive as CompetitiveAnalysis;
  const businessModelAnalysis = agentAnalyses.business_model as BusinessModelAnalysis;
  const legalAnalysis = agentAnalyses.legal as LegalAnalysis;
  
  // Default weights
  const defaultWeights: Record<VCAgentType, number> = {
    problem: 0.15,
    market: 0.15,
    competitive: 0.15,
    uvp: 0.15,
    business_model: 0.15,
    validation: 0.1,
    legal: 0.05,
    metrics: 0.1,
    vc_lead: 0,
    // Additional types not directly used in this analysis get 0 weight
    market_fit: 0,
    competition: 0,
    team: 0,
    financials: 0,
    traction: 0,
    investor_readiness: 0
  };
  
  // Pattern matching for business type
  let businessType = "General";
  let weights = {...defaultWeights};
  
  // Social Impact signals
  if (
    problemAnalysis.problem_framing === 'global' ||
    context.user_input.toLowerCase().includes("social impact") ||
    context.user_input.toLowerCase().includes("donation") ||
    context.user_input.toLowerCase().includes("non-profit") ||
    context.user_input.toLowerCase().includes("charity")
  ) {
    businessType = "Social Impact";
    weights = {
      ...defaultWeights,
      problem: 0.25,
      legal: 0.15,
      business_model: 0.20,
      market: 0.10,
      competitive: 0.10,
      uvp: 0.10,
      validation: 0.05,
      metrics: 0.05,
      vc_lead: 0
    };
  } 
  // B2B SaaS signals
  else if (
    context.user_input.toLowerCase().includes("saas") ||
    context.user_input.toLowerCase().includes("software") ||
    context.user_input.toLowerCase().includes("b2b") ||
    context.user_input.toLowerCase().includes("enterprise") ||
    businessModelAnalysis.revenue_model.toLowerCase().includes("subscription")
  ) {
    businessType = "B2B SaaS";
    weights = {
      ...defaultWeights,
      uvp: 0.20,
      market: 0.20,
      business_model: 0.20,
      problem: 0.15,
      competitive: 0.10,
      validation: 0.05,
      legal: 0.05,
      metrics: 0.05,
      vc_lead: 0
    };
  }
  // Consumer App signals
  else if (
    context.user_input.toLowerCase().includes("consumer") ||
    context.user_input.toLowerCase().includes("app") ||
    context.user_input.toLowerCase().includes("mobile")
  ) {
    businessType = "Consumer App";
    weights = {
      ...defaultWeights,
      uvp: 0.25,
      validation: 0.20,
      problem: 0.15,
      market: 0.15,
      competitive: 0.10,
      business_model: 0.10,
      legal: 0.025,
      metrics: 0.025,
      vc_lead: 0
    };
  }
  // Healthcare signals
  else if (
    context.user_input.toLowerCase().includes("health") ||
    context.user_input.toLowerCase().includes("medical") ||
    context.user_input.toLowerCase().includes("patient") ||
    legalAnalysis.risk_tags.some(tag => 
      tag.toLowerCase().includes("health") || 
      tag.toLowerCase().includes("medical") || 
      tag.toLowerCase().includes("hipaa")
    )
  ) {
    businessType = "Healthcare";
    weights = {
      ...defaultWeights,
      legal: 0.25,
      market: 0.20,
      validation: 0.15,
      problem: 0.15,
      business_model: 0.10,
      uvp: 0.05,
      competitive: 0.05,
      metrics: 0.05,
      vc_lead: 0
    };
  }
  // Marketplace signals
  else if (
    context.user_input.toLowerCase().includes("marketplace") ||
    context.user_input.toLowerCase().includes("platform") ||
    context.user_input.toLowerCase().includes("connect") ||
    businessModelAnalysis.revenue_model.toLowerCase().includes("transaction fee") ||
    businessModelAnalysis.revenue_model.toLowerCase().includes("commission")
  ) {
    businessType = "Marketplace";
    weights = {
      ...defaultWeights,
      competitive: 0.20,
      business_model: 0.20,
      market: 0.15,
      uvp: 0.15,
      problem: 0.10,
      validation: 0.10,
      legal: 0.05,
      metrics: 0.05,
      vc_lead: 0
    };
  }
  
  return { businessType, weights };
}

// Define the AgentAnalyses interface
export interface AgentAnalyses {
  problem: ProblemAnalysis | null;
  team: any | null;
  market: any | null;
  solution: any | null;
  business: any | null;
  competitor: any | null;
  timing: any | null;
  fundraising: any | null;
}

// Define agent function declarations - these will be implemented separately
async function runTeamAgentAnalysis(context: Record<string, any>): Promise<any> {
  console.log(`[TEAM-AGENT] This function is not yet implemented`);
  return { score: 70, reasoning: "Placeholder team analysis" };
}

async function runSolutionAgentAnalysis(context: Record<string, any>): Promise<any> {
  console.log(`[SOLUTION-AGENT] This function is not yet implemented`);
  return { score: 70, reasoning: "Placeholder solution analysis" };
}

async function runBusinessAgentAnalysis(context: Record<string, any>): Promise<any> {
  console.log(`[BUSINESS-AGENT] This function is not yet implemented`);
  return { score: 70, reasoning: "Placeholder business model analysis" };
}

async function runCompetitorAgentAnalysis(context: Record<string, any>): Promise<any> {
  console.log(`[COMPETITOR-AGENT] This function is not yet implemented`);
  return { score: 70, reasoning: "Placeholder competitor analysis" };
}

async function runTimingAgentAnalysis(context: Record<string, any>): Promise<any> {
  console.log(`[TIMING-AGENT] This function is not yet implemented`);
  return { score: 70, reasoning: "Placeholder timing analysis" };
}

async function runFundraisingAgentAnalysis(context: Record<string, any>): Promise<any> {
  console.log(`[FUNDRAISING-AGENT] This function is not yet implemented`);
  return { score: 70, reasoning: "Placeholder fundraising analysis" };
} 