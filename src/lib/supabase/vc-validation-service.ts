import { createClient } from "@supabase/supabase-js";
import type { VCAgentType, VCReport, VCValidationAnalysisRecord, VCAgentAnalysisRecord, VCValidationWithAnalyses } from "./types";
import type { Database } from "./database.types";

// Create Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a new VC validation
export async function createVCValidation(
  validationFormId: string,
  businessIdea: string
): Promise<{
  success: boolean;
  validationId?: string;
  error?: string;
}> {
  try {
    console.log(`Creating VC validation for form ID: ${validationFormId}`);
    
    // Check if validation already exists to avoid duplicate entries
    const { data: existingData, error: existingError } = await supabase
      .from("vc_validation_analyses")
      .select("id")
      .eq("validation_form_id", validationFormId)
      .maybeSingle();
      
    if (existingError && existingError.code !== 'PGRST116') {
      console.error("Error checking for existing validation:", existingError);
      throw new Error(`Database error: ${existingError.message}`);
    }
    
    // If validation already exists, return that ID
    if (existingData) {
      console.log(`Existing VC validation found with ID: ${existingData.id}`);
      return {
        success: true,
        validationId: existingData.id
      };
    }

    // Create the initial validation record with pending status
    const { data, error } = await supabase
      .from("vc_validation_analyses")
      .insert({
        validation_form_id: validationFormId,
        status: "pending",
        agent_responses: {},
        vc_report: {
          overall_score: 0,
          business_type: "Unspecified",
          weighted_scores: {},
          category_scores: {},
          recommendation: "",
          strengths: [],
          weaknesses: [],
          suggested_actions: [],
          idea_improvements: {
            original_idea: businessIdea,
            improved_idea: "",
            problem_statement: "",
            market_positioning: "",
            uvp: "",
            business_model: ""
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating VC validation:", error);
      return {
        success: false,
        error: `Failed to create VC validation: ${error.message}`
      };
    }

    console.log(`New VC validation created with ID: ${data.id}`);
    return {
      success: true,
      validationId: data.id
    };
  } catch (error) {
    console.error("Error in createVCValidation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Update the VC validation status
export async function updateVCValidationStatus(
  validationId: string,
  status: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`Updating VC validation status to "${status}" for ID: ${validationId}`);
    
    const { error } = await supabase
      .from("vc_validation_analyses")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", validationId);

    if (error) {
      console.error("Error updating VC validation status:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error in updateVCValidationStatus:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Add an agent analysis record
export async function addAgentAnalysis(
  validationId: string,
  agentType: VCAgentType,
  inputContext: Record<string, any>,
  analysis: Record<string, any>,
  score: number,
  reasoning: string,
  enhancedContext: Record<string, any>
): Promise<{
  success: boolean;
  analysisId?: string;
  error?: string;
}> {
  try {
    console.log(`Adding ${agentType} agent analysis for validation ID: ${validationId}`);
    
    // Insert the agent analysis record
    const { data, error } = await supabase
      .from("vc_agent_analyses")
      .insert({
        vc_validation_id: validationId,
        agent_type: agentType,
        input_context: inputContext,
        analysis: analysis,
        score,
        reasoning,
        enhanced_context: enhancedContext,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (error) {
      console.error(`Error adding ${agentType} agent analysis:`, error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get current agent_responses
    const { data: currentData, error: fetchError } = await supabase
      .from("vc_validation_analyses")
      .select("agent_responses")
      .eq("id", validationId)
      .single();
      
    if (fetchError) {
      console.error(`Error fetching current agent_responses:`, fetchError);
      // Continue with the operation, this is not critical
    }
    
    // Update the agent_responses field directly
    const updatedResponses = currentData?.agent_responses || {};
    updatedResponses[agentType] = analysis;
    
    const { error: updateError } = await supabase
      .from("vc_validation_analyses")
      .update({
        agent_responses: updatedResponses,
        updated_at: new Date().toISOString()
      })
      .eq("id", validationId);

    if (updateError) {
      console.error(`Error updating agent_responses with ${agentType} analysis:`, updateError);
      // Don't fail the operation, just log the error
    }

    console.log(`Added ${agentType} agent analysis with ID: ${data.id}`);
    return {
      success: true,
      analysisId: data.id
    };
  } catch (error) {
    console.error("Error in addAgentAnalysis:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Set the final VC report
export async function setVCReport(
  validationId: string,
  report: VCReport,
  overallScore: number | string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    console.log(`Setting final VC report for validation ID: ${validationId}`);
    
    // Convert the score to a number and round it to an integer
    // This handles both numeric values and string values like "73.25"
    let parsedScore: number;
    if (typeof overallScore === 'string') {
      parsedScore = Math.round(parseFloat(overallScore));
    } else {
      parsedScore = Math.round(overallScore);
    }
    
    console.log(`Parsed overall score: ${parsedScore} (original: ${overallScore})`);
    
    const { error } = await supabase
      .from("vc_validation_analyses")
      .update({
        vc_report: report,
        score: parsedScore,
        status: "completed",
        updated_at: new Date().toISOString()
      })
      .eq("id", validationId);

    if (error) {
      console.error("Error setting VC report:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Error in setVCReport:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Get a VC validation with all its agent analyses
export async function getVCValidationWithAnalyses(
  id: string
): Promise<{
  success: boolean;
  data?: VCValidationWithAnalyses;
  error?: string;
}> {
  try {
    console.log(`Fetching VC validation with analyses for ID: ${id}`);
    
    // First try to get the validation record by vc_validation_analyses.id
    let { data: validationData, error: validationError } = await supabase
      .from("vc_validation_analyses")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    // If not found by ID, try to find by validation_form_id
    if (!validationData) {
      console.log(`No VC validation found with ID ${id}, trying to find by form ID`);
      const { data: byFormData, error: byFormError } = await supabase
        .from("vc_validation_analyses")
        .select("*")
        .eq("validation_form_id", id)
        .maybeSingle();
        
      if (byFormError && byFormError.code !== 'PGRST116') {
        console.error("Error fetching VC validation by form ID:", byFormError);
        return {
          success: false,
          error: byFormError.message
        };
      }
      
      if (byFormData) {
        validationData = byFormData;
        console.log(`Found VC validation with form ID ${id}`);
      } else {
        console.error("No VC validation found with this ID or form ID");
        return {
          success: false,
          error: "No VC validation found"
        };
      }
    }

    // Get the validation form data
    const { data: formData, error: formError } = await supabase
      .from("validation_forms")
      .select("*")
      .eq("id", validationData.validation_form_id)
      .single();

    if (formError) {
      console.error("Error fetching validation form:", formError);
      return {
        success: false,
        error: formError.message
      };
    }

    // Get all agent analyses
    const { data: agentAnalysesData, error: agentAnalysesError } = await supabase
      .from("vc_agent_analyses")
      .select("*")
      .eq("vc_validation_id", validationData.id)
      .order("created_at", { ascending: true });

    if (agentAnalysesError) {
      console.error("Error fetching agent analyses:", agentAnalysesError);
      return {
        success: false,
        error: agentAnalysesError.message
      };
    }

    // Construct the full validation with analyses
    const result: VCValidationWithAnalyses = {
      form: formData,
      validation: validationData,
      agent_analyses: agentAnalysesData || []
    };

    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error("Error in getVCValidationWithAnalyses:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Get all VC validations for a user
export async function getUserVCValidations(userId: string): Promise<{
  success: boolean;
  data?: VCValidationAnalysisRecord[];
  error?: string;
}> {
  try {
    console.log(`Fetching VC validations for user ID: ${userId}`);
    
    const { data, error } = await supabase
      .from("vc_validation_analyses")
      .select(`
        *,
        validation_form!inner(*)
      `)
      .eq("validation_form.user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user's VC validations:", error);
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      data: data as VCValidationAnalysisRecord[]
    };
  } catch (error) {
    console.error("Error in getUserVCValidations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 