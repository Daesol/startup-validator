import OpenAI from "openai"
import type { ValidationFormValues } from "@/features/validation/types"

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

    try {
      const analysis = JSON.parse(content)
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
