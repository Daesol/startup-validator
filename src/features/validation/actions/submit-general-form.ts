"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { analyzeBusiness } from "@/lib/ai/business-analyzer"
import { saveValidationForm } from "@/lib/supabase/validation-service"
import { ValidationFormValues } from "../types"

export async function submitGeneralForm(formData: ValidationFormValues) {
  try {
    // Generate analysis
    const analysis = await analyzeBusiness(formData)

    // Save form data and analysis
    const result = await saveValidationForm(formData, analysis)

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      }
    }

    // Revalidate the path to ensure fresh data
    revalidatePath("/validate/report/[id]")

    // Redirect to the report page
    redirect(`/validate/report/${result.formId}`)
  } catch (error) {
    console.error("Error submitting form:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    }
  }
}
