"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { saveValidationForm } from "@/lib/supabase/validation-service"
import { createVCValidation, updateVCValidationStatus, addAgentAnalysis, setVCReport } from "@/lib/supabase/vc-validation-service"
import { runVCValidation } from "@/lib/ai/vc-validation/vc-analyzer"
import { VCAgentType } from "@/lib/supabase/types"

// Submit VC validation form data and start the multi-agent validation process
export async function submitVCValidationForm(formData: {
  businessIdea: string;
  websiteUrl?: string;
  additionalContext?: Record<string, any>;
}) {
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
    
    // Update status to "in_progress"
    await updateVCValidationStatus(validationId, "in_progress");
    
    // Start the VC validation process asynchronously
    // We don't want to block the redirect, so we don't await this
    processVCValidationAsync(validationId, formData.businessIdea, formData.additionalContext || {});

    // Revalidate the path
    revalidatePath(`/validate/vc-report/${formId}`);

    // Redirect to the report page - the page will show "processing" state
    redirect(`/validate/vc-report/${formId}`);
    
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

// Process the VC validation asynchronously
async function processVCValidationAsync(
  validationId: string,
  businessIdea: string,
  additionalContext: Record<string, any>
) {
  try {
    console.log("Starting async VC validation process for ID:", validationId);
    
    // Update status to "processing"
    await updateVCValidationStatus(validationId, "processing");
    
    // Create a function to save each agent analysis as it's completed
    const saveAgentAnalysis = async (agentType: VCAgentType, analysis: any) => {
      if (!analysis || agentType === 'vc_lead') return;
      
      // Extract the score and reasoning from the analysis
      const score = typeof analysis.score === 'number' 
        ? Math.round(analysis.score) 
        : (typeof analysis.score === 'string' ? Math.round(parseFloat(analysis.score)) : 0);
      const reasoning = analysis.reasoning || "";
      
      // Save the agent analysis
      const agentResult = await addAgentAnalysis(
        validationId,
        agentType,
        { businessIdea, ...additionalContext }, // Input context
        analysis, // The analysis result
        score,
        reasoning,
        {} // Enhanced context (empty for now)
      );
      
      if (agentResult.success) {
        console.log(`Saved ${agentType} agent analysis to database`);
      } else {
        console.error(`Error saving ${agentType} agent analysis:`, agentResult.error);
      }
    };
    
    // Create an event handler for agent completion
    const onAgentComplete = async (agentType: VCAgentType, analysis: any) => {
      await saveAgentAnalysis(agentType, analysis);
    };
    
    // Run the multi-agent validation with callbacks
    const result = await runVCValidation(
      businessIdea, 
      additionalContext,
      onAgentComplete  // Pass the callback
    );
    
    if (!result.success) {
      console.error("VC validation process failed:", result.error);
      await updateVCValidationStatus(validationId, "failed");
      return;
    }
    
    console.log("VC validation process completed successfully");
    
    // At this point, all agent analyses have already been saved individually through callbacks
    // We just need to save the final report
    
    if (result.vc_report) {
      // Wait a moment before saving final report to ensure UI captures all stages
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save the final VC report
      const overallScore = result.vc_report.overall_score;
      await setVCReport(validationId, result.vc_report, overallScore);
      
      // Update status to completed
      await updateVCValidationStatus(validationId, "completed");
      
      console.log("VC validation report saved to database");
    }
  } catch (error) {
    console.error("Error in processVCValidationAsync:", error);
    await updateVCValidationStatus(validationId, "failed");
  }
} 