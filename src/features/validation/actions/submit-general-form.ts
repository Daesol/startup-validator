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
    let analysisError = null;
    let analysis = null;
    let formId = null;
    
    try {
      // Generate analysis
      analysis = await analyzeBusiness({
        businessIdea: formData.businessIdea,
        website: formData.websiteUrl 
      });
    } catch (error) {
      console.error("Error generating analysis:", error);
      analysisError = error;
      // We continue the process even if analysis fails
    }

    // Save form data and analysis (even if analysis failed, we save the form)
    const result = await saveValidationForm({
      businessIdea: formData.businessIdea,
      websiteUrl: formData.websiteUrl
    }, "general", analysis || undefined);

    // Record the form ID for redirection
    formId = result.formId;

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    // Ensure we have a form ID
    if (!formId) {
      return {
        success: false,
        message: "No form ID returned from save operation",
      };
    }

    // Revalidate the specific path
    revalidatePath(`/validate/report/${formId}`, 'page');

    // Add a small delay to allow the client-side loading animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirect to the report page even if analysis failed
    // The report page will show appropriate UI for in-progress analysis
    throw redirect(`/validate/report/${formId}`);
  } catch (error) {
    // If it's a redirect, re-throw it
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error("Error submitting form:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    };
  }
}
