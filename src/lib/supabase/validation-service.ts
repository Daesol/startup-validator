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
        business_idea: formData.businessIdea,
        website: formData.websiteUrl || null,
        business_stage: formData.businessStage || null,
        business_type: formData.businessType || null,
        personal_problem: formData.personalProblem || null,
        target_audience: formData.targetAudience || null,
        target_audience_other: formData.targetAudienceOther || null,
        charging: formData.charging || null,
        differentiation: formData.differentiation || null,
        competitors: Array.isArray(formData.competitors) ? formData.competitors.join(",") : null,
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
        co_founder_count: formData.coFounderCount ? Number(formData.coFounderCount) : null,
        team_members: formData.teamMembers || null,
      })
      .select("id")
      .single()

    if (formError) {
      console.error("Error saving form:", formError)
      return { success: false, error: "Failed to save form data" }
    }

    // If we have analysis results, save them
    if (analysis && form.id) {
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
        return { success: false, error: "Failed to save analysis data" }
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

  // Get the validation form with analysis and team members
  const { data, error } = await supabaseServer
    .from("validation_forms")
    .select(`
      *,
      validation_analyses (*),
      team_members (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching validation form with analysis:", error)
    return null
  }

  return data as ValidationWithAnalysis
}
