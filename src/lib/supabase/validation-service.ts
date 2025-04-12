import { supabase } from "./client"
import { createServerSupabaseClient } from "./server"
import type { ValidationFormValues } from "@/features/validation/types"
import type { ValidationFormRecord, TeamMemberRecord, ValidationWithTeamMembers, AnalysisResultRecord, ValidationWithAnalysis } from "./types"
import type { AnalysisResult } from "@/lib/ai/business-analyzer"
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Client-side functions
export async function saveValidationForm(
  formData: ValidationFormValues,
  formType: "general" | "advanced",
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
        business_stage: formData.businessStage || null,
        business_type: formData.businessType || null,
        personal_problem: formData.personalProblem || null,
        target_audience: formData.targetAudience || null,
        target_audience_other: formData.targetAudienceOther || null,
        charging: formData.charging || null,
        differentiation: formData.differentiation || null,
        competitors: formData.competitors && formData.competitors.length > 0 ? formData.competitors : null,
        user_count: formData.userCount ? Number(formData.userCount) : null,
        mau: formData.mau ? Number(formData.mau) : null,
        monthly_revenue: formData.monthlyRevenue ? Number(formData.monthlyRevenue) : null,
        acquisition_channel: formData.acquisitionChannel || null,
        revenue_range: formData.revenueRange || null,
        pricing_model: formData.pricingModel || null,
        pricing_model_other: formData.pricingModelOther || null,
        cac: formData.cac ? Number(formData.cac) : null,
        ltv: formData.ltv ? Number(formData.ltv) : null,
        team_size: formData.teamSize ? Number(formData.teamSize) : null,
        raised_funds: formData.raisedFunds || null,
        funds_raised: formData.fundsRaised ? Number(formData.fundsRaised) : null,
        investors: formData.investors || null,
        co_founder_count: formData.coFounderCount ? Number(formData.coFounderCount) : null
      })
      .select("id")
      .single()

    if (formError) {
      console.error("Error saving form:", formError)
      return { success: false, error: "Failed to save form data" }
    }

    // Save team members if they exist
    if (formData.teamMembers && formData.teamMembers.length > 0) {
      const teamMembersToInsert = formData.teamMembers.map((member) => ({
        validation_form_id: form.id,
        person: member.person,
        skills: member.skills && member.skills.length > 0 ? member.skills : null
      }))

      const { error: teamError } = await supabase
        .from("team_members")
        .insert(teamMembersToInsert)

      if (teamError) {
        console.error("Error saving team members:", teamError)
        return { success: false, error: "Failed to save team members" }
      }
    }

    // Save analysis if it exists
    if (analysis) {
      const { error: analysisError } = await supabase
        .from("validation_analyses")
        .insert({
          validation_form_id: form.id,
          market_analysis: analysis.market_analysis,
          business_model: analysis.business_model,
          team_strength: analysis.team_strength,
          overall_assessment: analysis.overall_assessment,
        })

      if (analysisError) {
        console.error("Error saving analysis:", analysisError)
        return { success: false, error: "Failed to save analysis" }
      }
    }

    return { success: true, formId: form.id }
  } catch (error) {
    console.error("Error in saveValidationForm:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Server-side functions
export async function getValidationForms() {
  const supabaseServer = createServerSupabaseClient()

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
