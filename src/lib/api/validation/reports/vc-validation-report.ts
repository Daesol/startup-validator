import { setVCReport } from "@/lib/supabase/vc-validation-service";
import type { VCReport } from "@/lib/supabase/types";

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