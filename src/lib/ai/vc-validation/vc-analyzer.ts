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
}> {
  try {
    console.log("Starting VC validation for business idea:", businessIdea.substring(0, 100));
    
    // Initialize context with user input
    let context: Record<string, any> = {
      user_input: businessIdea,
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
    
    // 1. Problem Specialist - "The Diagnostician"
    const problemAnalysis = await runProblemAgentAnalysis(context);
    agentAnalyses.problem = problemAnalysis;
    context = {
      ...context,
      problem_analysis: problemAnalysis,
      enhanced_problem_statement: problemAnalysis.improved_problem_statement
    };
    console.log("Problem analysis completed, score:", problemAnalysis.score);
    if (onAgentComplete) await onAgentComplete('problem', problemAnalysis);
    
    // 2. Market Specialist - "The Opportunity Validator"
    const marketAnalysis = await runMarketAgentAnalysis(context);
    agentAnalyses.market = marketAnalysis;
    context = {
      ...context,
      market_analysis: marketAnalysis
    };
    console.log("Market analysis completed, score:", marketAnalysis.score);
    if (onAgentComplete) await onAgentComplete('market', marketAnalysis);
    
    // 3. Competitive Specialist - "The Moat Evaluator"
    const competitiveAnalysis = await runCompetitiveAgentAnalysis(context);
    agentAnalyses.competitive = competitiveAnalysis;
    context = {
      ...context,
      competitive_analysis: competitiveAnalysis,
      strengthened_differentiation: competitiveAnalysis.differentiation
    };
    console.log("Competitive analysis completed, score:", competitiveAnalysis.score);
    if (onAgentComplete) await onAgentComplete('competitive', competitiveAnalysis);
    
    // 4. UVP Specialist - "The Message Refiner"
    const uvpAnalysis = await runUVPAgentAnalysis(context);
    agentAnalyses.uvp = uvpAnalysis;
    context = {
      ...context,
      uvp_analysis: uvpAnalysis,
      refined_uvp: uvpAnalysis.one_liner
    };
    console.log("UVP analysis completed, score:", uvpAnalysis.score);
    if (onAgentComplete) await onAgentComplete('uvp', uvpAnalysis);
    
    // 5. Business Model Specialist - "The Monetization Analyst"
    const businessModelAnalysis = await runBusinessModelAgentAnalysis(context);
    agentAnalyses.business_model = businessModelAnalysis;
    context = {
      ...context,
      business_model_analysis: businessModelAnalysis,
      revenue_model: businessModelAnalysis.revenue_model
    };
    console.log("Business model analysis completed, score:", businessModelAnalysis.score);
    if (onAgentComplete) await onAgentComplete('business_model', businessModelAnalysis);
    
    // 6. Validation Specialist - "The Signal Seeker"
    const validationAnalysis = await runValidationAgentAnalysis(context);
    agentAnalyses.validation = validationAnalysis;
    context = {
      ...context,
      validation_analysis: validationAnalysis,
      validation_suggestions: validationAnalysis.validation_suggestions
    };
    console.log("Validation analysis completed, score:", validationAnalysis.score);
    if (onAgentComplete) await onAgentComplete('validation', validationAnalysis);
    
    // 7. Legal Specialist - "The Compliance Evaluator"
    const legalAnalysis = await runLegalAgentAnalysis(context);
    agentAnalyses.legal = legalAnalysis;
    context = {
      ...context,
      legal_analysis: legalAnalysis,
      risk_tags: legalAnalysis.risk_tags
    };
    console.log("Legal analysis completed, score:", legalAnalysis.score);
    if (onAgentComplete) await onAgentComplete('legal', legalAnalysis);
    
    // 8. Strategic Metrics Specialist - "The Quantifier"
    const metricsAnalysis = await runMetricsAgentAnalysis(context);
    agentAnalyses.metrics = metricsAnalysis;
    context = {
      ...context,
      metrics_analysis: metricsAnalysis
    };
    console.log("Metrics analysis completed, score:", metricsAnalysis.score);
    if (onAgentComplete) await onAgentComplete('metrics', metricsAnalysis);
    
    // Final VC Lead Agent - Synthesis and Report Generation
    const vcReport = await runVCLeadSynthesis(context, agentAnalyses as Record<VCAgentType, any>);
    agentAnalyses.vc_lead = {
      report: vcReport,
      reasoning: "Final synthesis of all agent analyses"
    };
    console.log("VC Lead synthesis completed, overall score:", vcReport.overall_score);
    
    return {
      success: true,
      vc_report: vcReport,
      agent_analyses: agentAnalyses as Record<VCAgentType, any>
    };
    
  } catch (error) {
    console.error("Error in VC validation process:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error in VC validation process"
    };
  }
}

// Individual agent functions
async function runProblemAgentAnalysis(context: Record<string, any>): Promise<ProblemAnalysis> {
  const prompt = getProblemAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
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
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Problem Agent");
  }
  
  return JSON.parse(content) as ProblemAnalysis;
}

async function runMarketAgentAnalysis(context: Record<string, any>): Promise<MarketAnalysis> {
  const prompt = getMarketAgentPrompt(context);
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
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
    temperature: 0.7,
    response_format: { type: "json_object" }
  });
  
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from Market Agent");
  }
  
  return JSON.parse(content) as MarketAnalysis;
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