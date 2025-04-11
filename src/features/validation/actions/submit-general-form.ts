"use server"

import { analyzeBusiness } from "@/lib/ai/business-analyzer"
import { saveValidationForm } from "@/lib/supabase/validation-service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitGeneralForm(data: {
  businessIdea: string
  websiteUrl?: string
}) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        message: "OpenAI API key is not configured. Please add it to your environment variables.",
      }
    }

    const { businessIdea, websiteUrl } = data

    if (!businessIdea || businessIdea.trim() === "") {
      return {
        success: false,
        message: "Business idea is required",
      }
    }

    // Format the data for analysis
    const formData = {
      businessIdea,
      website: websiteUrl || "",
      businessStage: "",
      businessType: "",
      personalProblem: false,
      targetAudience: "",
      targetAudienceOther: "",
      charging: false,
      differentiation: "",
      competitors: [],
      userCount: "",
      mau: "",
      monthlyRevenue: "",
      acquisitionChannel: "",
      revenueRange: "",
      pricingModel: "",
      pricingModelOther: "",
      cac: "",
      ltv: "",
      teamSize: "",
      raisedFunds: false,
      fundsRaised: "",
      investors: "",
      coFounderCount: "",
      teamMembers: [],
    }

    // Use AI to analyze the business idea and generate missing fields
    const analysis = await analyzeBusiness(formData)

    // Save the enhanced data to Supabase
    const { id: formId, error } = await saveValidationForm(formData, "general", analysis)

    if (error) {
      return {
        success: false,
        message: error,
      }
    }

    if (!formId) {
      return {
        success: false,
        message: "Failed to save validation data",
      }
    }

    revalidatePath("/validations")
    redirect(`/validate/report/${formId}`)
  } catch (error) {
    console.error("Error submitting general form:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
