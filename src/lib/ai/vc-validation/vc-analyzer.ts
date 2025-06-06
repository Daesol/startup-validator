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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main validation function that coordinates the multi-agent process
export async function runVCValidation(
  businessIdea: string,
  additionalContext: Record<string, any> = {},
  onAgentComplete?: (agentType: VCAgentType, analysis: any) => Promise<void>
): Promise<{
  success: boolean;
  vc_report?: VCReport;
  agent_analyses?: Record<VCAgentType, any>;
  error?: string;
  failed_at?: string;
  error_details?: Record<string, any>;
  partial_completion?: boolean;
  warning?: string;
}> {
  try {
    console.log("Starting VC validation for business idea:", businessIdea.substring(0, 100));
    
    // Trim and clean business idea
    const cleanBusinessIdea = businessIdea.trim();
    if (cleanBusinessIdea.length < 10) {
      return {
        success: false,
        error: "Business idea is too short for meaningful analysis",
        failed_at: "input_validation",
        error_details: { business_idea_length: cleanBusinessIdea.length }
      };
    }
    
    // Initialize context with user input
    let context: Record<string, any> = {
      user_input: cleanBusinessIdea,
      ...additionalContext
    };
    
    // Store all agent analyses
    const agentAnalyses: Partial<Record<VCAgentType, any>> = {
      problem: null,
      market: null,
      competitive: null,
      uvp: null,
      business_model: null,
      validation: null,
      legal: null,
      metrics: null,
      vc_lead: null,
      // Additional agent types that we aren't using in this specific flow
      // but are part of the VCAgentType union
      market_fit: null,
      competition: null,
      team: null,
      financials: null,
      traction: null,
      investor_readiness: null
    };
    
    // Track which agents have been completed
    const completedAgents: VCAgentType[] = [];
    const failedAgents: VCAgentType[] = [];
    
    // 1. Problem Specialist - "The Diagnostician"
    try {
      console.log("Starting Problem Agent analysis");
      const problemAnalysis = await runProblemAgentAnalysis(context);
      agentAnalyses.problem = problemAnalysis;
      context = {
        ...context,
        problem_analysis: problemAnalysis,
        enhanced_problem_statement: problemAnalysis.improved_problem_statement
      };
      console.log("Problem analysis completed, score:", problemAnalysis.score);
      completedAgents.push('problem');
      if (onAgentComplete) await onAgentComplete('problem', problemAnalysis);
    } catch (error) {
      const errorMsg = `Problem Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('problem');
      
      // For the problem agent specifically, we need to add a minimal problem statement to continue
      context.enhanced_problem_statement = cleanBusinessIdea;
      
      // Don't return early, try to continue with other agents
    }
    
    // 2. Market Specialist - "The Opportunity Validator"
    try {
      console.log("Starting Market Agent analysis");
      const marketAnalysis = await runMarketAgentAnalysis(context);
      agentAnalyses.market = marketAnalysis;
      context = {
        ...context,
        market_analysis: marketAnalysis
      };
      console.log("Market analysis completed, score:", marketAnalysis.score);
      completedAgents.push('market');
      if (onAgentComplete) await onAgentComplete('market', marketAnalysis);
    } catch (error) {
      const errorMsg = `Market Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('market');
      // Continue with other agents
    }
    
    // 3. Competitive Specialist - "The Moat Evaluator"
    try {
      console.log("Starting Competitive Agent analysis");
      const competitiveAnalysis = await runCompetitiveAgentAnalysis(context);
      agentAnalyses.competitive = competitiveAnalysis;
      context = {
        ...context,
        competitive_analysis: competitiveAnalysis,
        strengthened_differentiation: competitiveAnalysis.differentiation
      };
      console.log("Competitive analysis completed, score:", competitiveAnalysis.score);
      completedAgents.push('competitive');
      if (onAgentComplete) await onAgentComplete('competitive', competitiveAnalysis);
    } catch (error) {
      const errorMsg = `Competitive Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('competitive');
      // Continue with other agents
    }
    
    // 4. UVP Specialist - "The Message Refiner"
    try {
      console.log("Starting UVP Agent analysis");
      const uvpAnalysis = await runUVPAgentAnalysis(context);
      agentAnalyses.uvp = uvpAnalysis;
      context = {
        ...context,
        uvp_analysis: uvpAnalysis,
        refined_uvp: uvpAnalysis.one_liner
      };
      console.log("UVP analysis completed, score:", uvpAnalysis.score);
      completedAgents.push('uvp');
      if (onAgentComplete) await onAgentComplete('uvp', uvpAnalysis);
    } catch (error) {
      const errorMsg = `UVP Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('uvp');
      // Continue with other agents
    }
    
    // 5. Business Model Specialist - "The Monetization Analyst"
    try {
      console.log("Starting Business Model Agent analysis");
      const businessModelAnalysis = await runBusinessModelAgentAnalysis(context);
      agentAnalyses.business_model = businessModelAnalysis;
      context = {
        ...context,
        business_model_analysis: businessModelAnalysis,
        revenue_model: businessModelAnalysis.revenue_model
      };
      console.log("Business model analysis completed, score:", businessModelAnalysis.score);
      completedAgents.push('business_model');
      if (onAgentComplete) await onAgentComplete('business_model', businessModelAnalysis);
    } catch (error) {
      const errorMsg = `Business Model Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('business_model');
      // Continue with other agents
    }
    
    // 6. Validation Specialist - "The Signal Seeker"
    try {
      console.log("Starting Validation Agent analysis");
      const validationAnalysis = await runValidationAgentAnalysis(context);
      agentAnalyses.validation = validationAnalysis;
      context = {
        ...context,
        validation_analysis: validationAnalysis,
        validation_suggestions: validationAnalysis.validation_suggestions
      };
      console.log("Validation analysis completed, score:", validationAnalysis.score);
      completedAgents.push('validation');
      if (onAgentComplete) await onAgentComplete('validation', validationAnalysis);
    } catch (error) {
      const errorMsg = `Validation Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('validation');
      // Continue with other agents
    }
    
    // 7. Legal Specialist - "The Compliance Evaluator"
    try {
      console.log("Starting Legal Agent analysis");
      const legalAnalysis = await runLegalAgentAnalysis(context);
      agentAnalyses.legal = legalAnalysis;
      context = {
        ...context,
        legal_analysis: legalAnalysis,
        risk_tags: legalAnalysis.risk_tags
      };
      console.log("Legal analysis completed, score:", legalAnalysis.score);
      completedAgents.push('legal');
      if (onAgentComplete) await onAgentComplete('legal', legalAnalysis);
    } catch (error) {
      const errorMsg = `Legal Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('legal');
      // Continue with other agents
    }
    
    // 8. Strategic Metrics Specialist - "The Quantifier"
    try {
      console.log("Starting Metrics Agent analysis");
      const metricsAnalysis = await runMetricsAgentAnalysis(context);
      agentAnalyses.metrics = metricsAnalysis;
      context = {
        ...context,
        metrics_analysis: metricsAnalysis
      };
      console.log("Metrics analysis completed, score:", metricsAnalysis.score);
      completedAgents.push('metrics');
      if (onAgentComplete) await onAgentComplete('metrics', metricsAnalysis);
    } catch (error) {
      const errorMsg = `Metrics Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      failedAgents.push('metrics');
      // Continue with other agents
    }
    
    // Check if we have enough completed agents to generate a meaningful report
    const completionRate = completedAgents.length / 8; // 8 total agents
    console.log(`Agent completion rate: ${(completionRate * 100).toFixed(1)}% (${completedAgents.length}/8 agents completed)`);
    
    if (completedAgents.length === 0) {
      // If all agents failed, we can't generate a report
      return {
        success: false,
        agent_analyses: agentAnalyses as Record<VCAgentType, any>,
        error: "All validation agents failed to complete analysis",
        failed_at: "all_agents",
        error_details: {
          failed_agents: failedAgents,
          business_idea_length: cleanBusinessIdea.length
        }
      };
    }
    
    // Final VC Lead Agent - Synthesis and Report Generation
    try {
      console.log("Starting VC Lead synthesis");
      
      // If some agents failed but we have enough data, continue with synthesis
      if (failedAgents.length > 0) {
        console.log(`Proceeding with VC Lead synthesis with ${completedAgents.length}/8 completed agents.`);
      }
      
      const vcReport = await runVCLeadSynthesis(context, agentAnalyses as Record<VCAgentType, any>);
      
      // Add information about partial completion to the report
      if (failedAgents.length > 0) {
        vcReport.partial_completion = true;
        vcReport.completed_agents = completedAgents;
        vcReport.failed_agents = failedAgents;
      }
      
      agentAnalyses.vc_lead = {
        report: vcReport,
        reasoning: failedAgents.length > 0 
          ? `Synthesis of ${completedAgents.length}/8 completed agent analyses`
          : "Final synthesis of all agent analyses"
      };
      
      console.log("VC Lead synthesis completed, overall score:", vcReport.overall_score);
      
      return {
        success: true,
        vc_report: vcReport,
        agent_analyses: agentAnalyses as Record<VCAgentType, any>,
        partial_completion: failedAgents.length > 0,
        warning: failedAgents.length > 0 ? "Used fallback report generation due to synthesis failure" : undefined
      };
    } catch (error) {
      const errorMsg = `VC Lead synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      
      // If VC Lead synthesis fails, but we have completed agents,
      // generate a simple aggregated report instead
      if (completedAgents.length > 0) {
        try {
          console.log("Generating fallback report from completed agent analyses");
          
          // Calculate an average score
          let totalScore = 0;
          let scoreCount = 0;
          
          Object.entries(agentAnalyses).forEach(([key, analysis]) => {
            if (analysis && typeof analysis.score === 'number') {
              totalScore += analysis.score;
              scoreCount++;
            }
          });
          
          const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 60;
          
          // Collect strengths and weaknesses
          const strengths: string[] = [];
          const weaknesses: string[] = [];
          const actions: string[] = [];
          
          if (agentAnalyses.problem && agentAnalyses.problem.strengths) {
            strengths.push(...(agentAnalyses.problem.strengths || []).slice(0, 2));
          }
          if (agentAnalyses.market && agentAnalyses.market.strengths) {
            strengths.push(...(agentAnalyses.market.strengths || []).slice(0, 2));
          }
          if (agentAnalyses.problem && agentAnalyses.problem.weaknesses) {
            weaknesses.push(...(agentAnalyses.problem.weaknesses || []).slice(0, 2));
          }
          if (agentAnalyses.market && agentAnalyses.market.weaknesses) {
            weaknesses.push(...(agentAnalyses.market.weaknesses || []).slice(0, 2));
          }
          
          // Create a simple report
          const fallbackReport: VCReport = {
            overall_score: avgScore,
            business_type: "Startup",
            weighted_scores: {},
            category_scores: {},
            idea_improvements: {
              original_idea: cleanBusinessIdea,
              improved_idea: agentAnalyses.problem?.improved_problem_statement || cleanBusinessIdea,
              problem_statement: "See original idea",
              market_positioning: "",
              uvp: agentAnalyses.uvp?.one_liner || "",
              business_model: agentAnalyses.business_model?.revenue_model || ""
            },
            strengths: strengths.length > 0 ? strengths : ["Business idea provided for analysis"],
            weaknesses: weaknesses.length > 0 ? weaknesses : ["Complete analysis could not be performed"],
            suggested_actions: actions.length > 0 ? actions : ["Try again with a more detailed business description"],
            recommendation: `Based on the ${completedAgents.length} completed analyses, this idea has potential but requires refinement.`,
            partial_completion: true,
            completed_agents: completedAgents,
            failed_agents: [...failedAgents, 'vc_lead'],
            generation_method: "fallback",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          return {
            success: true,
            vc_report: fallbackReport,
            agent_analyses: agentAnalyses as Record<VCAgentType, any>,
            partial_completion: true,
            warning: "Used fallback report generation due to synthesis failure"
          };
        } catch (fallbackError) {
          console.error("Fallback report generation failed:", fallbackError);
        }
      }
      
      return {
        success: false,
        agent_analyses: agentAnalyses as Record<VCAgentType, any>,
        error: "Failed to synthesize VC report",
        failed_at: "vc_lead_synthesis",
        error_details: {
          agent: "vc_lead",
          message: errorMsg,
          completed_agents: completedAgents,
          failed_agents: failedAgents
        }
      };
    }
    
  } catch (error) {
    console.error("Error in VC validation process:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in VC validation process",
      failed_at: "general_process",
      error_details: {
        stack: error instanceof Error ? error.stack : undefined,
        business_idea_length: businessIdea.length
      }
    };
  }
}

// Individual agent functions
async function runProblemAgentAnalysis(context: Record<string, any>): Promise<ProblemAnalysis> {
  const prompt = getProblemAgentPrompt(context);
  
  // Extract the business idea for logging/debugging
  const businessIdea = context.user_input || "";
  console.log(`Problem agent analyzing business idea (length: ${businessIdea.length}): "${businessIdea.substring(0, 50)}..."`);
  
  // Define maximum retries
  const MAX_RETRIES = 2;
  let retryCount = 0;
  let lastError: Error | null = null;
  
  // Retry loop for API calls
  while (retryCount <= MAX_RETRIES) {
    try {
      // If this isn't the first attempt, log that we're retrying
      if (retryCount > 0) {
        console.log(`Retrying Problem Agent analysis (attempt ${retryCount}/${MAX_RETRIES})`);
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106", // Fallback to a more stable model after first try
        messages: [
          {
            role: "system",
            content: "You are the Problem Specialist Agent (The Diagnostician). Your role is to extract, clarify and strengthen the actual problem statement from the business idea."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5, // Lower temperature for more consistent results
        response_format: { type: "json_object" }
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
        console.error("Problem Agent returned invalid JSON:", errorMessage);
        console.error("Response content:", content.substring(0, 500));
        throw new Error(`Problem Agent returned invalid JSON: ${errorMessage}`);
      }
    } catch (error) {
      // Log the error and store it for potential later use
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Problem Agent analysis failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, lastError.message);
      
      // Increment retry counter and try again if not reached max
      retryCount++;
      
      // Wait before retrying (exponential backoff)
      if (retryCount <= MAX_RETRIES) {
        const backoffMs = Math.min(1000 * Math.pow(2, retryCount - 1), 8000);
        console.log(`Waiting ${backoffMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }
  
  // If we've exhausted all retries, create a fallback analysis
  console.log("All Problem Agent retries failed, generating fallback analysis");
  
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

async function runMarketAgentAnalysis(context: Record<string, any>): Promise<MarketAnalysis> {
  const prompt = getMarketAgentPrompt(context);
  
  // Extract the business idea for logging
  const businessIdea = context.user_input || "";
  console.log(`Market agent analyzing business context (enhanced problem: ${context.enhanced_problem_statement?.substring(0, 50) || "None"}...)`);
  
  // Define maximum retries
  const MAX_RETRIES = 2;
  let retryCount = 0;
  let lastError: Error | null = null;
  
  // Retry loop for API calls
  while (retryCount <= MAX_RETRIES) {
    try {
      // If this isn't the first attempt, log that we're retrying
      if (retryCount > 0) {
        console.log(`Retrying Market Agent analysis (attempt ${retryCount}/${MAX_RETRIES})`);
      }
      
      const response = await openai.chat.completions.create({
        model: retryCount === 0 ? "gpt-4-turbo-preview" : "gpt-3.5-turbo-1106", // Try with GPT-4 first, fallback to 3.5
        messages: [
          {
            role: "system",
            content: "You are the Market Specialist Agent (The Opportunity Validator). Your role is to analyze market size, growth potential, and validate the market opportunity."
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
          analysis.score = 65; // Default score
        }
        if (!analysis.reasoning) {
          analysis.reasoning = "Analysis completed with default values";
        }
        
        return analysis;
      } catch (parseError: unknown) {
        const errorMessage = parseError instanceof Error ? parseError.message : "Unknown parsing error";
        console.error("Market Agent returned invalid JSON:", errorMessage);
        console.error("Response content:", content.substring(0, 500));
        throw new Error(`Market Agent returned invalid JSON: ${errorMessage}`);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Market Agent analysis failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}):`, lastError.message);
      
      retryCount++;
      
      if (retryCount <= MAX_RETRIES) {
        const backoffMs = Math.min(1000 * Math.pow(2, retryCount - 1), 8000);
        console.log(`Waiting ${backoffMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }
  }
  
  // If we've exhausted all retries, create a fallback analysis
  console.log("All Market Agent retries failed, generating fallback analysis");
  
  // Create a fallback market analysis
  return {
    tam: 1000000000, // $1B
    sam: 300000000,  // $300M
    som: 30000000,   // $30M
    growth_rate: "Unknown, estimated 10-15%",
    market_demand: "Unable to determine precisely",
    why_now: "Current market conditions may be suitable",
    score: 60,
    reasoning: "Auto-generated due to API processing issues"
  };
}

async function runCompetitiveAgentAnalysis(context: Record<string, any>): Promise<CompetitiveAnalysis> {
  const prompt = getCompetitiveAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
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
    model: "gpt-4-turbo-preview",
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
    model: "gpt-4-turbo-preview",
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
    model: "gpt-4-turbo-preview",
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
    model: "gpt-4-turbo-preview",
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
    model: "gpt-4-turbo-preview",
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
    model: "gpt-4-turbo-preview",
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