import { 
  addAgentAnalysis as addAnalysis, 
  updateVCValidationStatus as updateStatus
} from "@/lib/supabase/vc-validation-service";

/**
 * Adds an agent analysis to a VC validation record
 * This is a proxy to the actual Supabase service function
 */
export const addAgentAnalysis = addAnalysis;

/**
 * Updates the status of a VC validation record
 * This is a proxy to the actual Supabase service function
 */
export const updateVCValidationStatus = updateStatus; 