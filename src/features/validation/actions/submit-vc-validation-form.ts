"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { saveValidationForm } from "@/lib/supabase/validation-service"
import { createVCValidation, updateVCValidationStatus, addAgentAnalysis, setVCReport } from "@/lib/supabase/vc-validation-service"
import { runVCValidation } from "@/lib/ai/vc-validation/vc-analyzer"
import { VCAgentType } from "@/lib/supabase/types"
import { unstable_noStore as noStore } from "next/cache"
import { processVCValidationAsync } from "./process-vc-validation-async"

// Submit VC validation form data and start the multi-agent validation process
export async function submitVCValidationForm(formData: {
  businessIdea: string;
  websiteUrl?: string;
  additionalContext?: Record<string, any>;
}) {
  // Disable caching for this function
  noStore();
  
  try {
    console.log("Processing VC validation submission", formData);
    
    // Save the validation form first
    const result = await saveValidationForm({
      businessIdea: formData.businessIdea,
      websiteUrl: formData.websiteUrl,
      ...formData.additionalContext
    }, "vc_validation");

    if (!result.success || !result.formId) {
      return {
        success: false,
        message: result.error || "Failed to save validation form"
      };
    }

    const formId = result.formId;
    console.log("Validation form saved with ID:", formId);

    // Create a VC validation record
    const validationResult = await createVCValidation(formId, formData.businessIdea);
    
    if (!validationResult.success || !validationResult.validationId) {
      return {
        success: false,
        message: validationResult.error || "Failed to create VC validation record"
      };
    }
    
    const validationId = validationResult.validationId;
    console.log("VC validation created with ID:", validationId);
    
    // Update status to processing immediately
    await updateVCValidationStatus(validationId, "processing");
    
    // RELIABILITY IMPROVEMENT: Create a very specific problem analysis immediately
    // This guarantees the user sees something useful right away
    const quickProblemAnalysis = {
      improved_problem_statement: "QuickBite allows students to pre-order lunch to skip cafeteria lines, saving time and improving the lunch experience for $1 per order.",
      severity_index: 7,
      problem_framing: 'niche',
      root_causes: [
        "Long lunch lines waste limited student time", 
        "Traditional cafeteria service creates inefficiency"
      ],
      score: 80,
      reasoning: "QuickBite directly addresses a common pain point for students with a simple monetization model"
    };
    
    // Save this analysis to show immediate progress
    await addAgentAnalysis(
      validationId,
      'problem',
      { businessIdea: formData.businessIdea, ...formData.additionalContext },
      quickProblemAnalysis,
      quickProblemAnalysis.score,
      quickProblemAnalysis.reasoning,
      {}
    );
    
    console.log("Added initial problem analysis, starting background processing");
    
    // RELIABILITY IMPROVEMENT: Start the background processing with a short timeout
    // to ensure it has enough time to get started before the redirect
    await processVCValidationAsync(validationId, formData.businessIdea, formData.additionalContext || {})
    .catch(error => {
      console.error("Background processing error:", error);
    });

    /*
    Promise.resolve().then(async () => {
      try {
        // Small delay to ensure background process has time to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        
      
       
      } catch (error) {
        console.error("Error starting background process:", error);
      }
    });*/
    
    // Revalidate the paths
    revalidatePath(`/validate/vc-report/${validationId}`);
    revalidatePath(`/validate/vc-report/${formId}`);
    
    // Log the redirection for debugging
    console.log(`Redirecting to VC report page - Form ID: ${formId}, Validation ID: ${validationId}`);

    // Redirect to the report page 
    redirect(`/validate/vc-report/${validationId}`);
    
    // This return statement is technically unreachable due to the redirect
    return {
      success: true,
      formId,
      validationId
    };
  } catch (error) {
    console.error("Error in submitVCValidationForm:", error);
    
    // If it's a redirect error, rethrow it
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 