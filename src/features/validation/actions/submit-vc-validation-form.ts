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
    
    // Update status to "in_progress" and immediately set to "processing"
    // This helps clients show status updates sooner
    await updateVCValidationStatus(validationId, "in_progress");
    await updateVCValidationStatus(validationId, "processing");
    
    // Detect Vercel environment
    const isVercel = process.env.VERCEL === '1';
    
    // Different handling for Vercel vs local environment
    if (isVercel) {
      // In Vercel: Start the process in the most lightweight way possible
      // We put this inside a try/catch but don't await it
      // The key here is to ensure the process gets started but doesn't
      // block the redirect or depend on this function's execution context
      try {
        console.log("Starting async VC validation in Vercel environment for ID:", validationId);
        
        // Start the process without awaiting
        processVCValidationAsync(validationId, formData.businessIdea, formData.additionalContext || {})
          .catch(error => {
            console.error("Background processing error (Vercel):", error);
          });
      } catch (err) {
        console.error("Error initiating async process in Vercel:", err);
        // Don't rethrow, we still want to redirect
      }
    } else {
      // In local/non-Vercel: Use Promise for clearer handling
      console.log("Starting async VC validation in non-Vercel environment for ID:", validationId);
      Promise.resolve().then(() => {
        processVCValidationAsync(validationId, formData.businessIdea, formData.additionalContext || {})
          .catch(error => {
            console.error("Background processing error (non-Vercel):", error);
          });
      });
    }

    // Revalidate the paths (both potential URLs)
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
      
      try {
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
      } catch (error) {
        console.error(`Error processing ${agentType} agent analysis:`, error);
        // Continue execution despite errors in individual agent saves
      }
    };
    
    // Create an event handler for agent completion
    const onAgentComplete = async (agentType: VCAgentType, analysis: any) => {
      await saveAgentAnalysis(agentType, analysis);
    };
    
    // Add timeout for the validation process (5 minutes)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("VC validation process timed out after 5 minutes")), 5 * 60 * 1000);
    });
    
    // Run the multi-agent validation with callbacks and timeout
    const validationPromise = runVCValidation(
      businessIdea, 
      additionalContext,
      onAgentComplete  // Pass the callback
    );
    
    // Race the validation process against the timeout
    const result = await Promise.race([validationPromise, timeoutPromise]) as Awaited<ReturnType<typeof runVCValidation>>;
    
    if (!result.success) {
      console.error("VC validation process failed:", result.error);
      console.error("Additional error details:", result.error_details || "No details available");
      console.error("Failed at agent:", result.failed_at || "Unknown stage");
      
      // Even if the process fails, we should check if we received partial results
      // that we can use to generate a basic report
      const agentAnalyses = result.agent_analyses as Partial<Record<VCAgentType, any>> || {};
      if (Object.keys(agentAnalyses).length > 0 && 
          Object.keys(agentAnalyses).some(key => agentAnalyses[key as VCAgentType] !== null)) {
        console.log("Generating fallback report from partial agent analyses");
        
        // Create a basic report from whatever agents completed successfully
        const fallbackReport = generateFallbackReport(businessIdea, agentAnalyses);
        
        // Save the fallback report
        await setVCReport(validationId, fallbackReport, 60); // Conservative score for fallback reports
        
        // Mark as completed with warning flag
        await updateVCValidationStatus(validationId, "completed_with_errors");
        
        return;
      }
      
      // If we can't generate a fallback report, mark as failed
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
    
    try {
      // Generate a diagnostic report with the error information
      const errorDetails = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : { message: "Unknown error type" };
      
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
    } catch (reportError) {
      console.error("Error creating fallback error report:", reportError);
    }
    
    // Update status to failed
    await updateVCValidationStatus(validationId, "failed");
  }
}

// Generate a basic report from partial agent analyses
function generateFallbackReport(businessIdea: string, agentAnalyses: Partial<Record<VCAgentType, any>>): any {
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
    partial_analysis: true,
    completed_agents: completedAgents,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
} 