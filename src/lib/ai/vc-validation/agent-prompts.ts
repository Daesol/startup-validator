import type { VCAgentType } from "@/lib/supabase/types";

// Problem Specialist Agent Prompt
export function getProblemAgentPrompt(context: Record<string, any>): string {
  return `
# Problem Specialist Agent - "The Diagnostician"

## Your Task
As the Problem Specialist Agent, your task is to extract, clarify, and strengthen the actual societal or functional problem from the business idea. You need to:

1. Extract the core problem being addressed
2. Clarify and rephrase it to be more precise
3. Identify root causes, scale, and urgency
4. Assess if this is a real, significant pain point

## Business Idea
${context.user_input}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "improved_problem_statement": "A clear, concise statement of the problem",
  "severity_index": 8, // A number from 1-10 indicating problem severity
  "problem_framing": "global", // Either "global" or "niche"
  "root_causes": [
    "Root cause 1",
    "Root cause 2"
  ],
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Focus on strengthening the problem definition. If the original idea is vague about the problem, create a clearer and more compelling problem statement. Be critical but constructive.
`;
}

// Market Specialist Agent Prompt
export function getMarketAgentPrompt(context: Record<string, any>): string {
  return `
# Market Specialist Agent - "The Opportunity Validator"

## Your Task
As the Market Specialist Agent, your task is to validate the market opportunity for this business idea. You need to:

1. Estimate TAM/SAM/SOM
2. Assess real-world market demand
3. Determine growth rate and trends
4. Explain "why now" is the right time for this idea

## Business Idea
${context.user_input}

## Enhanced Problem Statement
${context.problem_analysis ? context.problem_analysis.improved_problem_statement : "Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "tam": 5000000000, // Total Addressable Market in USD
  "sam": 1500000000, // Serviceable Addressable Market in USD
  "som": 300000000, // Serviceable Obtainable Market in USD
  "growth_rate": "15-20% annually",
  "market_demand": "Description of real-world demand and need",
  "why_now": "Explanation of why this is the right time for this solution",
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be realistic with your market size estimates, but don't be afraid to recognize a truly large opportunity when it exists.
`;
}

// Competitive Specialist Agent Prompt
export function getCompetitiveAgentPrompt(context: Record<string, any>): string {
  return `
# Competitive Specialist Agent - "The Moat Evaluator"

## Your Task
As the Competitive Specialist Agent, your task is to evaluate the competitive landscape and moat potential for this business idea. You need to:

1. Identify existing competitors or solutions
2. Highlight gaps in existing solutions
3. Strengthen the idea's differentiation angle
4. Assess the defensibility of the business

## Business Idea
${context.user_input}

## Enhanced Problem Statement
${context.problem_analysis ? context.problem_analysis.improved_problem_statement : "Not available"}

## Market Analysis
${context.market_analysis ? `
- TAM: $${Math.round(context.market_analysis.tam / 1000000)}M
- Growth Rate: ${context.market_analysis.growth_rate}
` : "Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "competitors": [
    {
      "name": "Competitor 1",
      "description": "Brief description",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"]
    }
  ],
  "differentiation": "Clear statement of how this idea differentiates from competitors",
  "moat_classification": "defensible", // Must be one of: "none", "weak", "defensible"
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

If you can't identify specific competitors, suggest similar or adjacent solutions. Be realistic about the defensibility of the business.
`;
}

// UVP Specialist Agent Prompt
export function getUVPAgentPrompt(context: Record<string, any>): string {
  return `
# UVP Specialist Agent - "The Message Refiner"

## Your Task
As the UVP Specialist Agent, your task is to craft and refine a clear, compelling unique value proposition. You need to:

1. Create a strong one-line UVP
2. Highlight emotional and strategic appeal
3. Show the before/after user outcome
4. Rate the stickiness and clarity of the value proposition

## Business Idea
${context.user_input}

## Enhanced Problem Statement
${context.problem_analysis ? context.problem_analysis.improved_problem_statement : "Not available"}

## Competitive Analysis
${context.competitive_analysis ? `
Differentiation: ${context.competitive_analysis.differentiation}
Moat Classification: ${context.competitive_analysis.moat_classification}
` : "Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "one_liner": "Clear, compelling one-line UVP",
  "emotional_appeal": "Description of emotional resonance with users",
  "strategic_appeal": "Description of strategic value to users or businesses",
  "before_after": {
    "before": "User situation before using the product",
    "after": "User situation after using the product"
  },
  "stickiness_score": 8, // How memorable the value prop is (1-10)
  "differentiation_clarity": 7, // How clearly differentiated (1-10)
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Focus on making the UVP clear, memorable, and differentiating. If the original idea is vague, take liberty to strengthen the value proposition significantly.
`;
}

// Business Model Specialist Agent Prompt
export function getBusinessModelAgentPrompt(context: Record<string, any>): string {
  return `
# Business Model Specialist Agent - "The Monetization Analyst"

## Your Task
As the Business Model Specialist Agent, your task is to analyze and improve the revenue model. You need to:

1. Determine if the model can generate sustainable revenue
2. Suggest or refine pricing strategy
3. Create pricing tiers if applicable
4. Assess monetization viability

## Business Idea
${context.user_input}

## Enhanced Problem Statement
${context.problem_analysis ? context.problem_analysis.improved_problem_statement : "Not available"}

## Unique Value Proposition
${context.uvp_analysis ? context.uvp_analysis.one_liner : "Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "revenue_model": "Description of how the business will make money",
  "pricing_tiers": [
    {
      "name": "Free",
      "price": "$0",
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "name": "Pro",
      "price": "$29/mo",
      "features": ["All Free features", "Premium Feature 1"]
    }
  ],
  "sustainability_factors": [
    "Factor that contributes to long-term revenue"
  ],
  "monetization_viability": 8, // 1-10 score on revenue potential
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be practical and realistic about monetization. If the original idea lacks a clear revenue model, suggest appropriate models for the type of business.
`;
}

// Validation Specialist Agent Prompt
export function getValidationAgentPrompt(context: Record<string, any>): string {
  return `
# Validation Specialist Agent - "The Signal Seeker"

## Your Task
As the Validation Specialist Agent, your task is to assess current validation and suggest future validation strategies. You need to:

1. Evaluate any existing validation efforts
2. Recommend how to validate further
3. Assess signal quality
4. Suggest potential customer quotes or validation metrics

## Business Idea
${context.user_input}

## Enhanced Problem Statement
${context.problem_analysis ? context.problem_analysis.improved_problem_statement : "Not available"}

## Business Model
${context.business_model_analysis ? `
Revenue Model: ${context.business_model_analysis.revenue_model}
` : "Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "current_validation": {
    "waitlist": false,
    "surveys": false,
    "interviews": false
  },
  "validation_suggestions": [
    "Suggestion for how to validate the idea"
  ],
  "signal_quality": "weak", // Must be one of: "none", "weak", "moderate", "strong"
  "user_quotes": [
    "Hypothetical quote that would indicate strong validation"
  ],
  "score": 5, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be honest about the current validation status, and realistic about what would constitute good validation for this specific idea.
`;
}

// Legal Specialist Agent Prompt
export function getLegalAgentPrompt(context: Record<string, any>): string {
  return `
# Legal Specialist Agent - "The Compliance Evaluator"

## Your Task
As the Legal Specialist Agent, your task is to identify legal and regulatory concerns. You need to:

1. Identify legal or regulatory friction points
2. Flag ethical concerns
3. Highlight operational liabilities
4. Suggest required disclaimers or compliance measures

## Business Idea
${context.user_input}

## Enhanced Problem Statement
${context.problem_analysis ? context.problem_analysis.improved_problem_statement : "Not available"}

## Business Model
${context.business_model_analysis ? `
Revenue Model: ${context.business_model_analysis.revenue_model}
` : "Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "friction_points": [
    "Legal or regulatory issue the business might face"
  ],
  "ethical_concerns": [
    "Potential ethical issue to consider"
  ],
  "operational_liabilities": [
    "Operational risk from a legal perspective"
  ],
  "required_disclaimers": [
    "Legal disclaimer or notice that would be required"
  ],
  "risk_tags": [
    "GDPR", "Privacy", "Intellectual Property"
  ],
  "risk_score": 6, // 1-10 score on legal risk (10 is highest risk)
  "compliance_readiness": "needs_work", // Must be one of: "not_ready", "needs_work", "ready"
  "score": 6, // Your overall score from 1-10 (10 is GOOD from a legal perspective)
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be thorough in identifying potential legal issues, but don't invent problems that aren't relevant to this specific business.
`;
}

// Metrics Specialist Agent Prompt
export function getMetricsAgentPrompt(context: Record<string, any>): string {
  return `
# Metrics Specialist Agent - "The Quantifier"

## Your Task
As the Metrics Specialist Agent, your task is to provide key strategic metrics. You need to:

1. Estimate important business metrics
2. Calculate ROI and success probability
3. Forecast scalability and growth metrics
4. Provide MVP cost estimate

## Business Idea
${context.user_input}

## Enhanced Problem Statement
${context.problem_analysis ? context.problem_analysis.improved_problem_statement : "Not available"}

## Market Analysis
${context.market_analysis ? `
- TAM: $${Math.round(context.market_analysis.tam / 1000000)}M
- SAM: $${Math.round(context.market_analysis.sam / 1000000)}M
- SOM: $${Math.round(context.market_analysis.som / 1000000)}M
` : "Not available"}

## Business Model
${context.business_model_analysis ? `
Revenue Model: ${context.business_model_analysis.revenue_model}
` : "Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "roi": "3.2x in Year 1",
  "scalability_index": 85, // 1-100 score on scalability
  "mvp_budget_estimate": "$75,000 - $120,000",
  "ltv": "$4,500", // Lifetime Value
  "cac": "$1,200", // Customer Acquisition Cost
  "success_rate": "65-75%", // Overall success probability
  "breakeven_point": "14-18 months",
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be realistic with your estimates, providing ranges when appropriate. Base your calculations on the market, business model, and competitive information available.
`;
}

// VC Lead Agent Prompt
export function getVCLeadPrompt(
  context: Record<string, any>,
  agentAnalyses: Record<VCAgentType, any>
): string {
  // Determine the appropriate weights based on business type
  const { businessType, weights } = inferBusinessTypeAndWeights(context, agentAnalyses);
  
  return `
# VC Lead Agent - Final Synthesis

## Your Task
As the VC Lead Agent, your task is to synthesize all specialist analyses into a comprehensive VC-style report. You need to:

1. Determine dynamic weighting based on the nature of the idea (already done for you)
2. Generate an overall score
3. Provide a VC-style recommendation
4. Identify strengths and weaknesses
5. Suggest next steps for the founder

## Business Idea
${context.user_input}

## Specialist Agent Analyses

### Problem Analysis
Score: ${agentAnalyses.problem?.score || "N/A"}/10
${agentAnalyses.problem?.improved_problem_statement || "Not available"}

### Market Analysis
Score: ${agentAnalyses.market?.score || "N/A"}/10
TAM: $${(agentAnalyses.market?.tam || 0) / 1000000}M
SAM: $${(agentAnalyses.market?.sam || 0) / 1000000}M
SOM: $${(agentAnalyses.market?.som || 0) / 1000000}M

### Competitive Analysis
Score: ${agentAnalyses.competitive?.score || "N/A"}/10
Moat: ${agentAnalyses.competitive?.moat_classification || "Not available"}

### UVP Analysis
Score: ${agentAnalyses.uvp?.score || "N/A"}/10
UVP: ${agentAnalyses.uvp?.one_liner || "Not available"}

### Business Model Analysis
Score: ${agentAnalyses.business_model?.score || "N/A"}/10
Revenue Model: ${agentAnalyses.business_model?.revenue_model || "Not available"}

### Validation Analysis
Score: ${agentAnalyses.validation?.score || "N/A"}/10
Signal Quality: ${agentAnalyses.validation?.signal_quality || "Not available"}

### Legal Analysis
Score: ${agentAnalyses.legal?.score || "N/A"}/10
Risk Level: ${agentAnalyses.legal?.risk_score || "N/A"}/10 (higher is more risky)

### Metrics Analysis
Score: ${agentAnalyses.metrics?.score || "N/A"}/10
ROI: ${agentAnalyses.metrics?.roi || "Not available"}
MVP Cost: ${agentAnalyses.metrics?.mvp_budget_estimate || "Not available"}

## Dynamic Weighting
Based on the business idea type (${businessType}), the following weights are applied:
${Object.entries(weights)
  .filter(([key]) => key !== 'vc_lead')
  .map(([key, value]) => `- ${key}: ${value * 100}%`)
  .join('\n')}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "overall_score": 72, // 0-100 score based on weighted average
  "business_type": "${businessType}",
  "weighted_scores": {
    "problem": 7.5,
    "market": 6.0,
    "competitive": 5.0,
    "uvp": 8.0,
    "business_model": 7.0,
    "validation": 4.0,
    "legal": 7.0,
    "metrics": 6.0
  },
  "category_scores": {
    "problem": 7,
    "market": 6,
    "competitive": 5,
    "uvp": 8,
    "business_model": 7,
    "validation": 4,
    "legal": 7,
    "metrics": 6
  },
  "idea_improvements": {
    "original_idea": "Brief summary of original idea",
    "improved_idea": "Stronger, more refined version of the idea",
    "problem_statement": "Improved problem statement",
    "market_positioning": "Improved market position",
    "uvp": "Improved value proposition",
    "business_model": "Improved business model"
  },
  "recommendation": "VC-style recommendation (fund, pass, or needs work)",
  "strengths": [
    "Key strength of the idea"
  ],
  "weaknesses": [
    "Key weakness of the idea"
  ],
  "suggested_actions": [
    "Action the founder should take next"
  ],
  "created_at": "${new Date().toISOString()}",
  "updated_at": "${new Date().toISOString()}"
}
\`\`\`

Make your assessment realistic and constructive. Apply the proper weighting to calculate the overall score.
`;
}

// Helper function to infer business type and appropriate weights
function inferBusinessTypeAndWeights(
  context: Record<string, any>,
  agentAnalyses: Record<VCAgentType, any>
): {
  businessType: string;
  weights: Record<VCAgentType, number>;
} {
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
    vc_lead: 0
  };
  
  // Pattern matching for business type
  let businessType = "General";
  let weights = {...defaultWeights};
  
  const userInput = (context.user_input || "").toLowerCase();
  const problemAnalysis = agentAnalyses.problem || {};
  const businessModelAnalysis = agentAnalyses.business_model || {};
  const legalAnalysis = agentAnalyses.legal || {};
  
  // Social Impact signals
  if (
    problemAnalysis.problem_framing === 'global' ||
    userInput.includes("social impact") ||
    userInput.includes("donation") ||
    userInput.includes("non-profit") ||
    userInput.includes("charity")
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
    userInput.includes("saas") ||
    userInput.includes("software") ||
    userInput.includes("b2b") ||
    userInput.includes("enterprise") ||
    (businessModelAnalysis.revenue_model || "").toLowerCase().includes("subscription")
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
    userInput.includes("consumer") ||
    userInput.includes("app") ||
    userInput.includes("mobile")
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
    userInput.includes("health") ||
    userInput.includes("medical") ||
    userInput.includes("patient") ||
    (legalAnalysis.risk_tags || []).some((tag: string) => 
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
    userInput.includes("marketplace") ||
    userInput.includes("platform") ||
    userInput.includes("connect") ||
    (businessModelAnalysis.revenue_model || "").toLowerCase().includes("transaction fee") ||
    (businessModelAnalysis.revenue_model || "").toLowerCase().includes("commission")
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