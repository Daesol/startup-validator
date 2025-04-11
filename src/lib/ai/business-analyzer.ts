import OpenAI from "openai"
import type { ValidationFormValues } from "@/features/validation/schemas/validation-form-schema"

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
}

export async function analyzeBusiness(
  formData: ValidationFormValues | { businessIdea: string; website?: string }
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

    const analysis = JSON.parse(content)
    return analysis
  } catch (error) {
    console.error("Error analyzing business:", error)
    throw error
  }
}

function createAnalysisPrompt(
  formData: ValidationFormValues | { businessIdea: string; website?: string }
): string {
  const isFullForm = "businessStage" in formData

  if (!isFullForm) {
    return `Analyze this startup idea and provide a detailed validation report in JSON format:

Business Idea: ${formData.businessIdea}
Website: ${formData.website || "Not provided"}

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

  return `Analyze this startup idea and provide a detailed validation report in JSON format:

Business Idea: ${formData.businessIdea}
Website: ${formData.website || "Not provided"}
Business Stage: ${formData.businessStage || "Not specified"}
Business Type: ${formData.businessType || "Not specified"}

Target Audience: ${formData.targetAudience || "Not specified"}
${formData.targetAudienceOther ? `Additional Target Audience: ${formData.targetAudienceOther}` : ""}

Problem Being Solved: ${formData.personalProblem || "Not specified"}
Revenue Model: ${formData.charging || "Not specified"}
Differentiation: ${formData.differentiation || "Not specified"}
Competitors: ${formData.competitors?.join(", ") || "Not specified"}

Metrics:
- Users: ${formData.userCount || "Not specified"}
- MAU: ${formData.mau || "Not specified"}
- Monthly Revenue: ${formData.monthlyRevenue || "Not specified"}
- CAC: ${formData.cac || "Not specified"}
- LTV: ${formData.ltv || "Not specified"}

Team:
- Size: ${formData.teamSize || "Not specified"}
- Co-founders: ${formData.coFounderCount || "Not specified"}
${formData.teamMembers?.map(member => `- ${member.person}: ${member.skills?.join(", ") || "No skills specified"}`).join("\n") || ""}

Funding:
- Raised: ${formData.raisedFunds ? "Yes" : "No"}
- Amount: ${formData.fundsRaised || "Not specified"}
- Investors: ${formData.investors || "Not specified"}

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
