"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { analyzeBusiness } from "@/lib/ai/business-analyzer"
import { saveValidationForm } from "@/lib/supabase/validation-service"

export async function submitGeneralForm(formData: {
  businessIdea: string;
  websiteUrl?: string;
}) {
  try {
    // Generate analysis
    const analysis = await analyzeBusiness({
      businessIdea: formData.businessIdea,
      website: formData.websiteUrl 
    })

    // Save form data and analysis
    const result = await saveValidationForm({
      businessIdea: formData.businessIdea,
      websiteUrl: formData.websiteUrl
    }, "general", analysis)

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      }
    }

    // Ensure we have a form ID
    if (!result.formId) {
      return {
        success: false,
        message: "No form ID returned from save operation",
      }
    }

    // Revalidate the specific path
    revalidatePath(`/validate/report/${result.formId}`, 'page')

    // Add a small delay to allow the client-side loading animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect to the report page
    // Using throw redirect to ensure the redirect happens
    throw redirect(`/validate/report/${result.formId}`)
  } catch (error) {
    // If it's a redirect, re-throw it
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error
    }

    console.error("Error submitting form:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    }
  }
}
