import { supabase } from "./client"
import { createServerSupabaseClient } from "./server"
import type { ValidationFormValues } from "@/features/validation/types"
import type { ValidationFormRecord, TeamMemberRecord, ValidationWithTeamMembers, AnalysisResultRecord, ValidationWithAnalysis } from "./types"
import type { AnalysisResult } from "@/lib/ai/business-analyzer"
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Client-side functions
export async function saveValidationForm(
  formData: ValidationFormValues | { businessIdea: string; websiteUrl?: string },
  formType: "general" | "advanced" | "vc_validation" = "general",
  analysis?: AnalysisResult
): Promise<{ success: boolean; formId?: string; error?: string }> {
  try {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Save the form data
    const { data: form, error: formError } = await supabase
      .from("validation_forms")
      .insert({
        form_type: formType,
        business_idea: formData.businessIdea,
        website: formData.websiteUrl || null,
        business_stage: 'businessStage' in formData ? formData.businessStage : null,
        business_type: 'businessType' in formData ? formData.businessType : null,
        personal_problem: 'personalProblem' in formData ? formData.personalProblem : null,
        target_audience: 'targetAudience' in formData ? formData.targetAudience : null,
        target_audience_other: 'targetAudienceOther' in formData ? formData.targetAudienceOther : null,
        charging: 'charging' in formData ? formData.charging : null,
        differentiation: 'differentiation' in formData ? formData.differentiation : null,
        competitors: 'competitors' in formData && formData.competitors && formData.competitors.length > 0 ? formData.competitors : null,
        user_count: 'userCount' in formData && formData.userCount ? Number(formData.userCount) : null,
        mau: 'mau' in formData && formData.mau ? Number(formData.mau) : null,
        monthly_revenue: 'monthlyRevenue' in formData && formData.monthlyRevenue ? Number(formData.monthlyRevenue) : null,
        acquisition_channel: 'acquisitionChannel' in formData ? formData.acquisitionChannel : null,
        revenue_range: 'revenueRange' in formData ? formData.revenueRange : null,
        pricing_model: 'pricingModel' in formData ? formData.pricingModel : null,
        pricing_model_other: 'pricingModelOther' in formData ? formData.pricingModelOther : null,
        cac: 'cac' in formData && formData.cac ? Number(formData.cac) : null,
        ltv: 'ltv' in formData && formData.ltv ? Number(formData.ltv) : null,
        team_size: 'teamSize' in formData && formData.teamSize ? Number(formData.teamSize) : null,
        raised_funds: 'raisedFunds' in formData ? formData.raisedFunds : null,
        funds_raised: 'fundsRaised' in formData && formData.fundsRaised ? Number(formData.fundsRaised) : null,
        investors: 'investors' in formData ? formData.investors : null,
        co_founder_count: 'coFounderCount' in formData && formData.coFounderCount ? Number(formData.coFounderCount) : null
      })
      .select("id")
      .single()

    if (formError) {
      console.error("Error saving form:", formError)
      return { success: false, error: "Failed to save form data" }
    }

    // Save team members if present
    if ('teamMembers' in formData && formData.teamMembers && formData.teamMembers.length > 0) {
      const teamMembersToInsert = formData.teamMembers.map(member => ({
        validation_form_id: form.id,
        person: member.person,
        skills: member.skills
      }))

      const { error: teamError } = await supabase
        .from("team_members")
        .insert(teamMembersToInsert)

      if (teamError) {
        console.error("Error saving team members:", teamError)
        // Continue even if team members fail to save
      }
    }

    // Save analysis if present
    if (analysis) {
      // Check if there's an existing analysis
      const { data: existingAnalysis, error: checkError } = await supabase
        .from("validation_analyses")
        .select("id")
        .eq("validation_form_id", form.id)
        
      // If there's already an analysis, update it
      if (!checkError && existingAnalysis && existingAnalysis.length > 0) {
        const { error: updateError } = await supabase
          .from("validation_analyses")
          .update({
            market_analysis: analysis.market_analysis,
            business_model: analysis.business_model,
            team_strength: analysis.team_strength,
            overall_assessment: analysis.overall_assessment,
            report_data: analysis.report_data || null,
            updated_at: new Date().toISOString()
          })
          .eq("validation_form_id", form.id)

        if (updateError) {
          console.error("Error updating analysis:", updateError)
          return { success: true, formId: form.id, error: "Analysis saved but validation failed" }
        }
      } else {
        // Otherwise, insert a new analysis
        const { error: analysisError } = await supabase
          .from("validation_analyses")
          .insert({
            validation_form_id: form.id,
            market_analysis: analysis.market_analysis,
            business_model: analysis.business_model,
            team_strength: analysis.team_strength,
            overall_assessment: analysis.overall_assessment,
            report_data: analysis.report_data || null
          })

        if (analysisError) {
          console.error("Error saving analysis:", analysisError)
          return { success: true, formId: form.id, error: "Form saved but analysis failed" }
        }
      }
    }

    return { success: true, formId: form.id }
  } catch (error) {
    console.error("Error in saveValidationForm:", error)
    return { success: false, error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

// Server-side functions
export async function getValidationForms() {
  const supabaseServer = createServerSupabaseClient()
  if (!supabaseServer) {
    console.error("Failed to create Supabase client")
    return []
  }

  const { data, error } = await supabaseServer
    .from("validation_forms")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching validation forms:", error)
    return []
  }

  return data as ValidationFormRecord[]
}

export async function getValidationFormWithAnalysis(id: string): Promise<ValidationWithAnalysis | null> {
  const supabaseServer = createServerSupabaseClient()
  if (!supabaseServer) {
    console.error("Failed to create Supabase client")
    return null
  }

  // Get the validation form with analysis
  const { data, error } = await supabaseServer
    .from("validation_forms")
    .select(`
      *,
      validation_analyses (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching validation form with analysis:", error)
    return null
  }

  return {
    ...data,
    team_members: [] // Return empty array for team members until we have a proper table
  } as ValidationWithAnalysis
}

export async function clearValidationTables(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Clear team_members table first (due to foreign key constraint)
    const { error: teamError } = await supabase
      .from("team_members")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all records

    if (teamError) {
      console.error("Error clearing team_members:", teamError)
      return { success: false, error: "Failed to clear team_members table" }
    }

    // Clear validation_analyses table next (due to foreign key constraint)
    const { error: analysisError } = await supabase
      .from("validation_analyses")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all records

    if (analysisError) {
      console.error("Error clearing validation_analyses:", analysisError)
      return { success: false, error: "Failed to clear validation_analyses table" }
    }

    // Clear validation_forms table last
    const { error: formError } = await supabase
      .from("validation_forms")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all records

    if (formError) {
      console.error("Error clearing validation_forms:", formError)
      return { success: false, error: "Failed to clear validation_forms table" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in clearValidationTables:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Add this utility function to check if an analysis is complete
export async function checkAnalysisStatus(validationFormId: string): Promise<{
  exists: boolean;
  isComplete: boolean;
  error?: string;
}> {
  try {
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    // Check if the analysis entry exists
    const { data, error } = await supabase
      .from("validation_analyses")
      .select("overall_assessment")
      .eq("validation_form_id", validationFormId)
      .maybeSingle()
      
    if (error && error.code !== 'PGRST116') {
      return { 
        exists: false,
        isComplete: false,
        error: error.message
      }
    }
    
    // If no data found, the analysis hasn't been created yet
    if (!data) {
      return {
        exists: false,
        isComplete: false
      }
    }
    
    // Check if the analysis has a completed overall assessment
    const isComplete = !!data.overall_assessment && 
                      typeof data.overall_assessment === 'object' &&
                      'viability_score' in data.overall_assessment
    
    return {
      exists: true,
      isComplete
    }
  } catch (error) {
    console.error("Error checking analysis status:", error)
    return {
      exists: false,
      isComplete: false,
      error: error instanceof Error ? error.message : "Unknown error checking analysis status"
    }
  }
}
