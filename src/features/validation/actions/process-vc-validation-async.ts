import { setVCReport, addAgentAnalysis, updateVCValidationStatus } from "@/lib/supabase/vc-validation-service";
import { runVCValidation } from "@/lib/ai/vc-validation/vc-analyzer";
import type { VCReport, VCAgentType } from "@/lib/supabase/types";
import { supabase } from "@/lib/supabase/vc-validation-service";

/**
 * Adds a processing log entry to the database for debugging
 * @param validationId The validation ID
 * @param message The log message
 * @param details Optional details object
 */
async function logToDatabase(
  validationId: string, 
  message: string, 
  details?: Record<string, any>
): Promise<void> {
  try {
    // First get current logs
    const { data, error: fetchError } = await supabase
      .from("vc_validation_analyses")
      .select("processing_logs")
      .eq("id", validationId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching existing logs:", fetchError);
      return;
    }
    
    // Create new log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      details
    };
    
    // Append to existing logs or create new array
    const updatedLogs = Array.isArray(data?.processing_logs) 
      ? [...data.processing_logs, logEntry]
      : [logEntry];
    
    // Update with new logs
    const { error } = await supabase
      .from("vc_validation_analyses")
      .update({
        processing_logs: updatedLogs,
        updated_at: new Date().toISOString()
      })
      .eq("id", validationId);
      
    if (error) {
      console.error("Error adding log to database:", error);
    }
  } catch (e) {
    console.error("Failed to write log to database:", e);
  }
}

/**
 * Runs the VC validation process asynchronously
 * This function is intended to be run in the background
 * @param validationId The ID of the validation record to process
 * @param businessIdea The business idea to validate
 * @param additionalContext Additional context for the validation
 */
export async function processVCValidationAsync(
  validationId: string,
  businessIdea: string,
  additionalContext: Record<string, any> = {}
): Promise<void> {
  console.log(`Starting background VC validation for ID ${validationId}`);
  await logToDatabase(validationId, "Background validation process started", {
    environment: process.env.VERCEL === '1' ? 'Vercel' : 'Local',
    businessIdeaLength: businessIdea.length,
    timestamp: new Date().toISOString()
  });
  
  // Add a timeout safety net for the entire process
  const processTimeoutMs = 180000; // 3 minutes max for full process
  const processTimeout = setTimeout(() => {
    logToDatabase(validationId, "Process timeout triggered - 3 minute limit reached", {
      error: "Process timeout",
      timestamp: new Date().toISOString()
    });
  }, processTimeoutMs);
  
  try {
    // Run the validation process - now optimized for reliability with just Problem Analysis
    await logToDatabase(validationId, "Calling runVCValidation with enhanced timeout", {
      apiTimeout: process.env.VERCEL === '1' ? '30s' : '60s'
    });
    
    // Start the validation process with a long timeout
    const validationTimeout = setTimeout(() => {
      logToDatabase(validationId, "Validation API timeout - possible hung request", {
        error: "API timeout",
        timestamp: new Date().toISOString()
      });
    }, 45000); // 45 second check for validation call
    
    const validationResult = await runVCValidation(
      businessIdea,
      additionalContext
    );
    
    // Clear the validation timeout since we got a response
    clearTimeout(validationTimeout);
    
    console.log("VC validation result:", JSON.stringify(validationResult.success));
    await logToDatabase(validationId, "runVCValidation returned", { 
      success: validationResult.success,
      hasError: !!validationResult.error,
      errorMessage: validationResult.error,
      errorDetails: validationResult.error_details,
      failedAt: validationResult.failed_at
    });
    
    if (!validationResult.success) {
      console.error("VC validation failed:", validationResult.error);
      await logToDatabase(validationId, "Validation process failed", { error: validationResult.error });
      await updateVCValidationStatus(validationId, "failed");
      return;
    }
    
    // Process and update the individual agent analyses
    const { agent_analyses: agentAnalyses, vc_report: vcReport } = validationResult;
    await logToDatabase(validationId, "Processing agent analyses", { 
      agentCount: Object.keys(agentAnalyses || {}).length,
      hasReport: !!vcReport
    });
    
    // Store each agent's analysis separately
    for (const [agentType, analysis] of Object.entries(agentAnalyses || {})) {
      try {
        if (!analysis) continue;
        console.log(`Updating ${agentType} analysis for validation ${validationId}`);
        await logToDatabase(validationId, `Processing ${agentType} agent result`);
        
        // Use type assertion to access properties safely
        const typedAnalysis = analysis as any;
        
        await addAgentAnalysis(
          validationId,
          agentType as VCAgentType,
          { businessIdea, ...additionalContext },
          typedAnalysis,
          typedAnalysis.score || 0,
          typedAnalysis.reasoning || "Analysis completed",
          typedAnalysis.metadata || {}
        );
        
        await logToDatabase(validationId, `Successfully stored ${agentType} agent result`);
      } catch (error) {
        console.error(`Error updating ${agentType} analysis:`, error);
        await logToDatabase(validationId, `Error processing ${agentType} agent`, { 
          error: error instanceof Error ? error.message : String(error) 
        });
        // Continue processing other analyses even if one fails
      }
    }
    
    // Update the VC validation report
    try {
      console.log("Updating VC validation report for ID:", validationId);
      await logToDatabase(validationId, "Updating final VC report");
      
      if (vcReport) {
        await updateVCValidationReport(validationId, vcReport);
        await logToDatabase(validationId, "Successfully updated VC report");
      } else {
        // Generate a fallback report if no VC report was provided
        console.log("[ASYNC] No VC report in result, using fallback report generation");
        await logToDatabase(validationId, "No VC report in result, generating fallback");
        
        const fallbackReport = generateFallbackReport(businessIdea, validationResult.agent_analyses);
        await setVCReport(validationId, fallbackReport, 65);
        await updateVCValidationStatus(validationId, "completed_with_errors");
        await logToDatabase(validationId, "Saved fallback report", { status: "completed_with_errors" });
        
        console.log("[ASYNC] Saved fallback report and updated status to 'completed_with_errors'");
        return;
      }
    } catch (error) {
      console.error("Error updating VC report:", error);
      await logToDatabase(validationId, "Error updating VC report", { 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
    
    // Mark the validation as complete
    await updateVCValidationStatus(validationId, "completed");
    await logToDatabase(validationId, "Validation process completed successfully", { status: "completed" });
    console.log(`Completed VC validation for ID ${validationId}`);
    
    // Clear the overall process timeout
    clearTimeout(processTimeout);
    
  } catch (error) {
    console.error("Unhandled error in VC validation process:", error);
    await logToDatabase(validationId, "Unhandled error in validation process", { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    try {
      // Try to update the status to failed
      await handleValidationError(validationId, businessIdea, error);
      
      // Clear the process timeout even on error
      clearTimeout(processTimeout);
    } catch (statusUpdateError) {
      console.error("Failed to update validation status:", statusUpdateError);
      await logToDatabase(validationId, "Failed to handle validation error", { 
        error: statusUpdateError instanceof Error ? statusUpdateError.message : String(statusUpdateError) 
      });
    }
  }
}

/**
 * Updates the VC validation report for a given validation ID
 * @param validationId The ID of the validation record
 * @param report The VC report data to save
 * @returns Promise with the result of the operation
 */
export async function updateVCValidationReport(
  validationId: string,
  report: VCReport
): Promise<{ success: boolean; error?: string }> {
  console.log(`[VC-REPORT] Updating VC validation report for ID: ${validationId}`);
  
  try {
    // Calculate the overall score from the report
    const overallScore = report.overall_score || 70;
    
    // Use the existing setVCReport function from vc-validation-service
    const result = await setVCReport(validationId, report, overallScore);
    
    console.log(`[VC-REPORT] Successfully updated report for validation ID: ${validationId}`);
    return { success: true };
  } catch (error) {
    console.error("[VC-REPORT] Error updating validation report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Helper function to handle validation errors
 * @param validationId The ID of the validation record 
 * @param businessIdea The business idea being validated
 * @param error The error that occurred
 */
async function handleValidationError(validationId: string, businessIdea: string, error: unknown): Promise<void> {
  console.error("[ASYNC] Error type:", error instanceof Error ? error.name : typeof error);
  console.error("[ASYNC] Error message:", error instanceof Error ? error.message : String(error));
  console.error("[ASYNC] Error stack:", error instanceof Error ? error.stack : "No stack available");
  
  try {
    // Generate a diagnostic report with the error information
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : { message: "Unknown error type" };
    
    console.log("[ASYNC] Creating error fallback report");
    
    // Create a minimal fallback report
    const errorReport = {
      overall_score: 50,
      business_type: "Unspecified",
      weighted_scores: {},
      category_scores: {},
      recommendation: "The validation process encountered technical difficulties. " +
                    "We recommend trying again or using the standard validation option.",
      strengths: [],
      weaknesses: [],
      suggested_actions: ["Try validating with the basic validator instead"],
      idea_improvements: {
        original_idea: businessIdea,
        improved_idea: businessIdea,
        problem_statement: "",
        market_positioning: "",
        uvp: "",
        business_model: ""
      },
      diagnostics: {
        error: errorDetails,
        timestamp: new Date().toISOString()
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save the error report
    await setVCReport(validationId, errorReport, 50);
    console.log("[ASYNC] Error report saved successfully");
  } catch (reportError) {
    console.error("[ASYNC] Error creating fallback error report:", reportError);
  }
  
  // Update status to failed
  await updateVCValidationStatus(validationId, "failed");
  console.log("[ASYNC] Status updated to 'failed'");
}

/**
 * Generate a basic report from partial agent analyses
 * @param businessIdea The business idea being validated
 * @param agentAnalyses The partial agent analyses 
 * @returns A fallback VC report
 */
function generateFallbackReport(businessIdea: string, agentAnalyses: Partial<Record<VCAgentType, any>>): VCReport {
  // Get all completed agent keys
  const completedAgents = Object.keys(agentAnalyses).filter(
    k => agentAnalyses[k as VCAgentType] !== null
  ) as VCAgentType[];
  
  console.log(`Generating fallback report from ${completedAgents.length} completed agents:`, completedAgents);
  
  // Calculate an average score from all available agent scores
  const scores = completedAgents.map(agent => {
    const analysis = agentAnalyses[agent];
    if (!analysis || typeof analysis.score !== 'number') return 0;
    return analysis.score;
  }).filter(score => score > 0);
  
  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : 60; // Default fallback score
  
  // Extract strengths and weaknesses from available agents
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const actions: string[] = [];
  
  // Add best information from each completed agent
  completedAgents.forEach(agent => {
    const analysis = agentAnalyses[agent];
    if (!analysis) return;
    
    // Add strengths if available
    if (analysis.strengths && Array.isArray(analysis.strengths)) {
      strengths.push(...analysis.strengths.slice(0, 2));
    }
    
    // Add weaknesses if available
    if (analysis.weaknesses && Array.isArray(analysis.weaknesses)) {
      weaknesses.push(...analysis.weaknesses.slice(0, 2));
    }
    
    // Add actions or recommendations if available
    if (analysis.recommendations && Array.isArray(analysis.recommendations)) {
      actions.push(...analysis.recommendations.slice(0, 2));
    } else if (analysis.suggested_actions && Array.isArray(analysis.suggested_actions)) {
      actions.push(...analysis.suggested_actions.slice(0, 2));
    }
  });
  
  // Create category scores from available agent analyses
  const categoryScores: Record<string, number> = {};
  
  if (agentAnalyses.problem) categoryScores.problem = agentAnalyses.problem.score || 0;
  if (agentAnalyses.market) categoryScores.market = agentAnalyses.market.score || 0;
  if (agentAnalyses.competitive) categoryScores.competition = agentAnalyses.competitive.score || 0;
  if (agentAnalyses.business_model) categoryScores.business_model = agentAnalyses.business_model.score || 0;
  if (agentAnalyses.uvp) categoryScores.unique_value = agentAnalyses.uvp.score || 0;
  if (agentAnalyses.validation) categoryScores.validation = agentAnalyses.validation.score || 0;
  
  return {
    overall_score: avgScore,
    business_type: "Startup", // Default
    weighted_scores: {
      problem: 0.2,
      market: 0.2,
      competition: 0.15,
      business_model: 0.25,
      unique_value: 0.2
    },
    category_scores: categoryScores,
    recommendation: "This is a partial analysis based on the successfully completed portions of the validation process.",
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
    suggested_actions: [...actions.slice(0, 5), "Consider running a standard validation for more complete results"],
    idea_improvements: {
      original_idea: businessIdea,
      improved_idea: agentAnalyses.problem?.improved_problem_statement || businessIdea,
      problem_statement: agentAnalyses.problem?.problem_statement || "",
      market_positioning: agentAnalyses.market?.target_segment || "",
      uvp: agentAnalyses.uvp?.one_liner || "",
      business_model: agentAnalyses.business_model?.revenue_model || ""
    },
    partial_completion: true,
    completed_agents: completedAgents,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
} 