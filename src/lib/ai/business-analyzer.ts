import OpenAI from "openai"
import type { ValidationFormValues } from "@/features/validation/types"
import { getInvestorReportPrompt, parseReportDataResponse } from "./investor-report-prompt"
import type { ReportData } from "../supabase/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type AnalysisResult = {
  market_analysis: {
    market_size: string
    growth_potential: string
    target_audience: string
    competitive_landscape: string
  }
  business_model: {
    revenue_potential: string
    scalability: string
    sustainability: string
    risks: string
  }
  team_strength: {
    expertise: string
    gaps: string
    recommendations: string
  }
  overall_assessment: {
    viability_score: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
  report_data?: ReportData
}

export async function analyzeBusiness(
  formData: ValidationFormValues | { businessIdea: string; website?: string },
  generateReportData: boolean = true
): Promise<AnalysisResult> {
  const prompt = createAnalysisPrompt(formData)

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert startup validator with experience in venture capital and business analysis. 
          Analyze the provided startup information and generate a comprehensive validation report.
          Focus on market potential, business model viability, and team strength.
          Be critical but constructive in your analysis.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    try {
      const analysis = JSON.parse(content) as AnalysisResult
      
      // Generate the enhanced report data if requested
      if (generateReportData) {
        const reportData = await generateInvestorReportData(formData)
        if (reportData) {
          analysis.report_data = reportData
        }
      }
      
      return analysis
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError)
      throw new Error("Failed to parse analysis response")
    }
  } catch (error) {
    console.error("Error analyzing business:", error)
    throw error
  }
}

export async function generateInvestorReportData(
  formData: ValidationFormValues | { businessIdea: string; website?: string }
): Promise<ReportData | null> {
  try {
    // Extract any team members from the form data
    const teamMembers = 'teamMembers' in formData ? formData.teamMembers : []
    
    // Create a flattened form data object for easier processing
    const flattenedFormData: Record<string, any> = { 
      ...formData
    }
    
    // Debug the business idea going into the report generator
    const businessIdea = formData.businessIdea;
    console.log(`Business idea for report generation - Type: ${typeof businessIdea}, Length: ${businessIdea?.length}`);
    console.log(`Business idea first 50 chars: ${businessIdea?.substring(0, 50)}`);
    
    // Create the prompt for the investor report
    const prompt = getInvestorReportPrompt(
      businessIdea,
      flattenedFormData,
      teamMembers
    )
    
    // Get the completion from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert startup analyst specializing in creating professional investor reports. Always include the full original business idea in your output."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    })
    
    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error("No content received from OpenAI for investor report")
    }
    
    // Parse the response to get the report data
    const reportData = parseReportDataResponse(content)
    
    // Ensure that the user_input field always contains the complete original business idea
    if (reportData) {
      if (reportData.user_input !== formData.businessIdea) {
        console.log('Fixing user_input in report data to match original business idea');
        reportData.user_input = formData.businessIdea;
      }
    }
    
    return reportData
  } catch (error) {
    console.error("Error generating investor report data:", error)
    return null
  }
}

function createAnalysisPrompt(
  formData: ValidationFormValues | { businessIdea: string; website?: string }
): string {
  // Check if it's the full form or simplified form
  const isSimplifiedForm = "website" in formData
  const isFullForm = "businessStage" in formData

  if (isSimplifiedForm || !isFullForm) {
    // Handle simplified form data
    const website = isSimplifiedForm ? formData.website : (formData as ValidationFormValues).websiteUrl

    return `Analyze this startup idea and provide a detailed validation report in JSON format:

Business Idea: ${formData.businessIdea}
Website: ${website || "Not provided"}

Please provide a comprehensive analysis in the following JSON structure:
{
  "market_analysis": {
    "market_size": "string",
    "growth_potential": "string",
    "target_audience": "string",
    "competitive_landscape": "string"
  },
  "business_model": {
    "revenue_potential": "string",
    "scalability": "string",
    "sustainability": "string",
    "risks": "string"
  },
  "team_strength": {
    "expertise": "string",
    "gaps": "string",
    "recommendations": "string"
  },
  "overall_assessment": {
    "viability_score": number,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"]
  }
}`
  }

  // We know it's the full form at this point
  const fullFormData = formData as ValidationFormValues

  // Handle full form data with ValidationFormValues type
  return `Analyze this startup idea and provide a detailed validation report in JSON format:

Business Idea: ${fullFormData.businessIdea}
Website: ${fullFormData.websiteUrl || "Not provided"}
Business Stage: ${fullFormData.businessStage || "Not specified"}
Business Type: ${fullFormData.businessType || "Not specified"}

Target Audience: ${fullFormData.targetAudience || "Not specified"}
${fullFormData.targetAudienceOther ? `Additional Target Audience: ${fullFormData.targetAudienceOther}` : ""}

Problem Being Solved: ${fullFormData.personalProblem || "Not specified"}
Revenue Model: ${fullFormData.charging || "Not specified"}
Differentiation: ${fullFormData.differentiation || "Not specified"}
Competitors: ${fullFormData.competitors?.join(", ") || "Not specified"}

Metrics:
- Users: ${fullFormData.userCount || "Not specified"}
- MAU: ${fullFormData.mau || "Not specified"}
- Monthly Revenue: ${fullFormData.monthlyRevenue || "Not specified"}
- CAC: ${fullFormData.cac || "Not specified"}
- LTV: ${fullFormData.ltv || "Not specified"}

Team:
- Size: ${fullFormData.teamSize || "Not specified"}
- Co-founders: ${fullFormData.coFounderCount || "Not specified"}
${fullFormData.teamMembers?.map(member => 
  `- ${member.person}: ${member.skills.join(", ")}`
).join("\n") || ""}

Funding:
- Raised: ${fullFormData.raisedFunds ? "Yes" : "No"}
- Amount: ${fullFormData.fundsRaised || "Not specified"}
- Investors: ${fullFormData.investors || "Not specified"}

Please provide a comprehensive analysis in the following JSON structure:
{
  "market_analysis": {
    "market_size": "string",
    "growth_potential": "string",
    "target_audience": "string",
    "competitive_landscape": "string"
  },
  "business_model": {
    "revenue_potential": "string",
    "scalability": "string",
    "sustainability": "string",
    "risks": "string"
  },
  "team_strength": {
    "expertise": "string",
    "gaps": "string",
    "recommendations": "string"
  },
  "overall_assessment": {
    "viability_score": number,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"]
  }
}`
}

// Create a simplified report data structure based on the legacy format
export function generateLegacyReportData(validation: AnalysisResult): ReportData {
  const viabilityScore = validation.overall_assessment.viability_score;
  
  // Since we only have the analysis result, we don't have direct access to the business idea
  // We need to reconstruct it from available data
  let businessIdea = "Business idea not available"; // Fallback
  
  // Try to extract something meaningful from the analysis that could represent the business idea
  if (validation.market_analysis?.target_audience) {
    businessIdea = `A business addressing needs of ${validation.market_analysis.target_audience}`;
    if (validation.market_analysis.market_size) {
      businessIdea += ` in a ${validation.market_analysis.market_size} market`;
    }
  }
  
  return {
    business_type: validation.business_model?.revenue_potential ? "Startup" : "Idea",
    overall_score: viabilityScore,
    feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
    investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
    estimated_valuation: "$500K – $1M", // Placeholder
    
    user_input: businessIdea, // Use reconstructed business idea
    ai_interpretation: generateAIInterpretation(validation),
    
    summary_metrics: {
      overall_score: viabilityScore,
      feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
      time_to_mvp: "4-8 weeks", // Placeholder
      investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
      pre_rev_valuation: "$500K – $1M" // Placeholder
    },
    frameworks_used: ["YC", "a16z", "Sequoia"],
    
    problem: {
      summary: validation.market_analysis?.target_audience || "Problem not specified",
      clarity_status: "Vague",
      pain_severity: 7,
      alternatives: ["Existing solutions", "Manual processes"],
      ai_summary: validation.market_analysis?.target_audience || "The problem affects the target audience."
    },
    
    target_audience: {
      segments: [validation.market_analysis?.target_audience || "Early adopters"],
      motivation: "Seeking solution to their problems",
      buyer_user_table: {
        buyer: "Decision maker",
        user: "End user"
      },
      persona_suggestions: ["Primary user persona"]
    },
    
    market: {
      tam: 1000000000,
      sam: 300000000,
      som: 30000000,
      trends: [validation.market_analysis?.growth_potential || "Growing market"],
      why_now: "The timing is right due to market conditions"
    },
    
    competition: {
      competitors: [{
        name: "Competitor 1",
        strengths: "Established brand",
        weaknesses: "Higher pricing"
      }],
      moat_status: "Moderate",
      positioning: {
        x_axis: 7,
        y_axis: 6
      }
    },
    
    uvp: {
      one_liner: "Unique value proposition",
      before_after: {
        before: "Before: Challenge faced",
        after: "After: Problem solved"
      },
      rating: Math.floor(viabilityScore / 10)
    },
    
    business_model: {
      pricing_tiers: [
        {
          name: "Free",
          price: "$0",
          features: ["Basic features"]
        },
        {
          name: "Pro",
          price: "$29/mo",
          features: ["Advanced features"]
        }
      ],
      revenue_estimation: "$10K-50K MRR in first year",
      upsell_suggestions: ["Enterprise tier", "Add-on services"]
    },
    
    customer_validation: {
      status: {
        landing_page: false,
        waitlist: false,
        interviews: false
      },
      best_quote: "From customer interviews",
      feedback_stats: {
        signups: 0,
        feedback_rate: 0
      }
    },
    
    pricing: {
      roi_match: 8,
      models: ["Subscription"],
      suggestions: ["Consider tiered pricing"]
    },
    
    legal: {
      risks: ["Standard compliance requirements"],
      current_state: {
        "Terms of Service": false,
        "Privacy Policy": false
      },
      disclaimer_links: {
        "Terms": "#",
        "Privacy": "#"
      }
    },
    
    metrics: {
      success_rate: "75-80%",
      investment_score: 84,
      breakeven_point: "8 months",
      cac: "$30-50",
      ltv: "$240",
      roi_year1: "3.2x",
      market_size_som: "$10M",
      scalability_index: 87,
      mvp_cost: "$1,800"
    },
    
    vc_methodologies: {
      "Y Combinator": "Team, traction",
      "a16z": "Moat, market fit",
      "Sequoia": "Market clarity"
    },
    
    recommendation: {
      summary: "Based on our analysis, we recommend proceeding with caution while validating key assumptions.",
      next_steps: [
        {
          task: "Launch MVP",
          completed: false
        },
        {
          task: "Run user interviews",
          completed: false
        },
        {
          task: "Prepare pitch for investors",
          completed: false
        }
      ]
    },
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function generateAIInterpretation(validation: AnalysisResult): string {
  // Implementation of generateAIInterpretation function
  return "AI interpretation based on the validation analysis"
}
