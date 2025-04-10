"use server"

import { analyzeBusiness } from "@/lib/ai/business-analyzer"
import { saveValidationForm } from "@/lib/supabase/validation-service"
import { revalidatePath } from "next/cache"

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

    // Use AI to analyze the business idea and generate missing fields
    const enhancedData = await analyzeBusiness(businessIdea, websiteUrl)

    // Save the enhanced data to Supabase
    const formId = await saveValidationForm(enhancedData, "general")

    if (!formId) {
      return {
        success: false,
        message: "Failed to save validation data",
      }
    }

    revalidatePath("/validations")

    return {
      success: true,
      message: "Your idea has been analyzed and submitted for validation!",
      formId,
    }
  } catch (error) {
    console.error("Error submitting general form:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
