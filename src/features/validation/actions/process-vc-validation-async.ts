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
 * Get the existing analyses from the database to pass to subsequent agent processing
 * @param validationId The validation ID
 */
async function getExistingAnalyses(validationId: string): Promise<Record<string, any>> {
  try {
    // Get all agent analyses for this validation
    const { data, error } = await supabase
      .from("vc_agent_analyses")
      .select("*")
      .eq("vc_validation_id", validationId);
      
    if (error) {
      console.error("Error fetching existing analyses:", error);
      return {};
    }
    
    // Convert to agent type -> analysis mapping
    const analyses: Record<string, any> = {};
    for (const item of data || []) {
      analyses[item.agent_type] = item.analysis;
    }
    
    return analyses;
  } catch (e) {
    console.error("Failed to get existing analyses:", e);
    return {};
  }
}

// Checkpoint logging helper
async function checkpoint(name: string, details?: Record<string, any>): Promise<Record<string, any> | undefined> {
  console.log(`[DEBUG-CHECKPOINT] ${name}`);
  return details;
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
  console.log(`[DEBUG] Starting background VC validation for ID ${validationId}`);
  await logToDatabase(validationId, "Background validation process started", {
    environment: process.env.VERCEL === '1' ? 'Vercel' : 'Local',
    businessIdeaLength: businessIdea.length,
    timestamp: new Date().toISOString()
  });
  
  // Instead of a single timeout for the whole process, we'll handle each agent separately
  try {
    await checkpoint("starting-chunked-processing");
    
    // Start with the problem agent
    //await processNextAgent(validationId, "problem", businessIdea, additionalContext);
     // Start with the problem agent by making a fetch request to the API endpoint
     const apiUrl = `/api/process-agent`;
     const response = await fetch(apiUrl, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         validationId,
         agentType: "problem",
         businessIdea,
         additionalContext
       }),
     });
     
     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(`API error: ${errorData.message || response.statusText}`);
     }
    
  } catch (error) {
    console.error("Error starting chunked validation process:", error);
    await logToDatabase(validationId, "Error starting chunked validation process", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    try {
      // Try to update the status to failed
      await handleValidationError(validationId, businessIdea, error);
    } catch (statusUpdateError) {
      console.error("Failed to update validation status:", statusUpdateError);
    }
  }
}

/**
 * Process a single agent and then queue the next one if needed
 * This function is called recursively for each agent
 */
export async function processNextAgent(
  validationId: string,
  agentType: VCAgentType | undefined,
  businessIdea: string,
  additionalContext: Record<string, any> = {}
): Promise<void> {
  try {
    if (!agentType) {
      console.log(`[CHUNKED] No agent specified, validation complete for ${validationId}`);
      await updateVCValidationStatus(validationId, "completed");
      await logToDatabase(validationId, "Validation process completed successfully", { status: "completed" });
      return;
    }
    
    console.log(`[CHUNKED] Processing agent ${agentType} for validation ${validationId}`);
    await checkpoint(`processing-agent-${agentType}`);
    
    // Get existing analyses to provide context for this agent
    const existingAnalyses = await getExistingAnalyses(validationId);
    
    // Set a timeout for this specific agent
    const agentTimeoutMs = 45000; // 45 seconds max for a single agent
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Agent ${agentType} timed out after ${agentTimeoutMs}ms`)), agentTimeoutMs);
    });
    
    // Process this specific agent
    const enrichedContext: Record<string, any> = {
      ...additionalContext,
      existing_analyses: existingAnalyses
    };
    
    // Race the agent processing against the timeout
    const agentResult = await Promise.race([
      runVCValidation(businessIdea, enrichedContext, undefined, agentType),
      timeoutPromise
    ]);
    
    await checkpoint(`completed-agent-${agentType}`);
    
    // Store this agent's analysis
    if (agentResult.success) {
      // Get the specific analysis for this agent type
      let analysisData: any = null;
      
      // Extract the analysis based on the agent type
      switch (agentType) {
        case 'problem':
          analysisData = agentResult.agent_analyses.problem;
          break;
        case 'market':
          analysisData = agentResult.agent_analyses.market;
          break;
        case 'competitive':
          analysisData = agentResult.agent_analyses.competitor;
          break;
        default:
          // For other types, check additionalContext where they are stored
          const contextKey = `${agentType}_analysis`;
          analysisData = enrichedContext[contextKey];
      }
      
      if (analysisData) {
        console.log(`Storing ${agentType} analysis for validation ${validationId}`);
        await logToDatabase(validationId, `Storing ${agentType} analysis`);
        
        await addAgentAnalysis(
          validationId,
          agentType,
          { businessIdea, ...additionalContext },
          analysisData,
          analysisData.score || 0,
          analysisData.reasoning || "Analysis completed",
          {}
        );
        
        await logToDatabase(validationId, `Successfully stored ${agentType} agent result`);
      } else {
        console.warn(`No analysis data for agent ${agentType}`);
        await logToDatabase(validationId, `No analysis data for agent ${agentType}`);
      }
      
      // If this was the final agent and we have a report, save it
      if (agentResult.vc_report && !agentResult.next_agent) {
        await updateVCValidationReport(validationId, agentResult.vc_report);
        await logToDatabase(validationId, "Final report generated and saved");
        await updateVCValidationStatus(validationId, "completed");
        return;
      }
      
      // Queue the next agent processing
      if (agentResult.next_agent) {
        console.log(`[CHUNKED] Queueing next agent: ${agentResult.next_agent}`);
        await logToDatabase(validationId, `Queueing next agent: ${agentResult.next_agent}`);
        
        // Use setTimeout to prevent stack overflow from recursive calls
        setTimeout(async () => {
            const apiUrl = `/api/process-agent`;
            fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                validationId,
                agentType: agentResult.next_agent,
                businessIdea,
                additionalContext
              }),
            });
            
     
          /*processNextAgent(validationId, agentResult.next_agent, businessIdea, additionalContext)
            .catch(error => {
              console.error(`[CHUNKED] Error processing next agent ${agentResult.next_agent}:`, error);
              logToDatabase(validationId, `Error processing next agent ${agentResult.next_agent}`, {
                error: error instanceof Error ? error.message : String(error)
              });
              
              // Try to continue with the next agent despite this error
              const agentOrder: VCAgentType[] = [
                'problem', 'market', 'competitive', 'uvp', 
                'business_model', 'validation', 'legal', 'metrics'
              ];
              
              const currentIndex = agentOrder.indexOf(agentResult.next_agent as VCAgentType);
              if (currentIndex < agentOrder.length - 1) {
                const skipToAgent = agentOrder[currentIndex + 1];
                console.log(`[CHUNKED] Skipping to agent ${skipToAgent} after error`);
                processNextAgent(validationId, skipToAgent, businessIdea, additionalContext);
              }
            });*/
        }, 1000);
      } else {
        // No next agent but we should have a report by now
        if (agentResult.vc_report) {
          await updateVCValidationReport(validationId, agentResult.vc_report);
          await updateVCValidationStatus(validationId, "completed");
          await logToDatabase(validationId, "All agents processed, validation complete");
        } else {
          // Generate a fallback report if somehow we're at the end with no report
          await logToDatabase(validationId, "No report at end of processing, generating fallback");
          const fallbackReport = generateFallbackReport(businessIdea, existingAnalyses);
          await setVCReport(validationId, fallbackReport, 65);
          await updateVCValidationStatus(validationId, "completed_with_errors");
        }
      }
    } else {
      // Agent processing failed
      console.error(`[CHUNKED] Error processing agent ${agentType}:`, agentResult.error);
      await logToDatabase(validationId, `Error processing agent ${agentType}`, {
        error: agentResult.error,
        errorDetails: agentResult.error_details
      });
      
      // Try to continue with the next agent despite this error
      const agentOrder: VCAgentType[] = [
        'problem', 'market', 'competitive', 'uvp', 
        'business_model', 'validation', 'legal', 'metrics'
      ];
      
      const currentIndex = agentOrder.indexOf(agentType as VCAgentType);
      if (currentIndex < agentOrder.length - 1) {
        const nextAgent = agentOrder[currentIndex + 1];
        console.log(`[CHUNKED] Skipping to next agent ${nextAgent} after error`);
        await logToDatabase(validationId, `Skipping to next agent ${nextAgent} after error`);
        
        setTimeout(() => {
          const apiUrl = `/api/process-agent`;
          fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              validationId,
              agentType: nextAgent,
              businessIdea,
              additionalContext
            }),
          });
          //processNextAgent(validationId, nextAgent, businessIdea, additionalContext);
        }, 1000);
      } else {
        // We've reached the end but with errors, generate a fallback report
        await logToDatabase(validationId, "Reached end of agent chain with errors, generating fallback report");
        const fallbackReport = generateFallbackReport(businessIdea, existingAnalyses);
        await setVCReport(validationId, fallbackReport, 65);
        await updateVCValidationStatus(validationId, "completed_with_errors");
      }
    }
  } catch (error) {
    console.error(`[CHUNKED] Unhandled error processing agent ${agentType}:`, error);
    await logToDatabase(validationId, `Unhandled error processing agent ${agentType}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Try to continue with next agent despite this error
    const agentOrder: VCAgentType[] = [
      'problem', 'market', 'competitive', 'uvp', 
      'business_model', 'validation', 'legal', 'metrics'
    ];
    
    const currentIndex = agentOrder.indexOf(agentType as VCAgentType);
    if (currentIndex < agentOrder.length - 1) {
      const nextAgent = agentOrder[currentIndex + 1];
      console.log(`[CHUNKED] Skipping to next agent ${nextAgent} after unhandled error`);
      
      setTimeout(() => {
        const apiUrl = `/api/process-agent`;
         fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            validationId,
            agentType: nextAgent,
            businessIdea,
            additionalContext
          }),
        });
        //processNextAgent(validationId, nextAgent, businessIdea, additionalContext);
      }, 1000);
    } else {
      // Generate a fallback report if we hit an error on the last agent
      const fallbackReport = generateFallbackReport(businessIdea, await getExistingAnalyses(validationId));
      await setVCReport(validationId, fallbackReport, 60);
      await updateVCValidationStatus(validationId, "completed_with_errors");
    }
  }
}
