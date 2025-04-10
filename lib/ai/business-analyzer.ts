import type { ValidationFormValues } from "@/features/validation/schemas/validation-form-schema"
import { OpenAI } from "openai"

export async function analyzeBusiness(businessIdea: string, website?: string): Promise<Partial<ValidationFormValues>> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `
Analyze the following business idea and extract key information to fill out a startup validation form.
Be realistic and conservative in your analysis. If you're uncertain about any field, provide a reasonable guess based on the information available.

Business Idea: ${businessIdea}
${website ? `Website: ${website}` : ""}

Please provide the following information in JSON format:
- businessType: The type of business (SaaS, E-commerce, Marketplace, Mobile App, Hardware, Consumer, B2B, etc.)
- businessStage: The stage of the business (Idea, Prototype, MVP, Growth, Scale)
- personalProblem: Boolean indicating if this solves a personal problem (true/false)
- targetAudience: The target audience (Consumers, Small Businesses, Enterprise, Developers, etc.)
- charging: Boolean indicating if the business is likely charging customers yet (true/false)
- differentiation: How this business differentiates from competitors
- competitors: Array of likely competitors
- userCount: Estimated user count range
- mau: Estimated monthly active users range
- monthlyRevenue: Estimated monthly revenue range
- acquisitionChannel: Likely main acquisition channel
- pricingModel: Likely pricing model
- teamSize: Estimated team size
- coFounderCount: Estimated number of co-founders (0 for solo founder)
- teamMembers: Array of likely team roles with skills

Return ONLY valid JSON without any explanation or additional text.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a business analyst that responds only with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    // Get the response text
    const text = response.choices[0].message.content || "{}"

    // Parse the JSON response
    const analysisResult = JSON.parse(text)

    // Map the AI response to our form schema
    return {
      businessIdea,
      website: website || "",
      businessType: analysisResult.businessType || "",
      businessStage: analysisResult.businessStage || "",
      personalProblem: analysisResult.personalProblem || false,
      targetAudience: analysisResult.targetAudience || "",
      charging: analysisResult.charging || false,
      differentiation: analysisResult.differentiation || "",
      competitors: analysisResult.competitors || [],
      userCount: analysisResult.userCount || "",
      mau: analysisResult.mau || "",
      monthlyRevenue: analysisResult.monthlyRevenue || "",
      acquisitionChannel: analysisResult.acquisitionChannel || "",
      pricingModel: analysisResult.pricingModel || "",
      teamSize: analysisResult.teamSize || "",
      coFounderCount: analysisResult.coFounderCount?.toString() || "0",
      teamMembers: analysisResult.teamMembers?.map((member: any) => ({
        person: member.role || member.person || "Team Member",
        skills: member.skills || [],
      })) || [{ person: "Founder", skills: [] }],
    }
  } catch (error) {
    console.error("Error analyzing business idea:", error)
    // Return minimal default values if analysis fails
    return {
      businessIdea,
      website: website || "",
      businessType: "Other",
      businessStage: "Idea",
    }
  }
}
