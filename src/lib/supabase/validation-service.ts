import { supabase } from "./client"
import { createServerSupabaseClient } from "./server"
import type { ValidationFormValues } from "@/features/validation/schemas/validation-form-schema"
import type { ValidationFormRecord, TeamMemberRecord, ValidationWithTeamMembers, AnalysisResultRecord, ValidationWithAnalysis } from "./types"
import type { AnalysisResult } from "@/lib/ai/business-analyzer"

// Client-side functions
export async function saveValidationForm(
  data: Partial<ValidationFormValues>,
  formType: "general" | "advanced",
  analysis?: AnalysisResult
): Promise<{ id: string | null; error: string | null }> {
  try {
    // Ensure business_idea is not null for general form
    if (formType === "general" && (!data.businessIdea || data.businessIdea.trim() === "")) {
      return { id: null, error: "Business idea is required" }
    }

    // First, save the validation form
    const { data: formData, error: formError } = await supabase
      .from("validation_forms")
      .insert({
        form_type: formType,
        business_idea: data.businessIdea || null,
        website: data.website || null,
        business_stage: data.businessStage || null,
        business_type: data.businessType || null,
        personal_problem: data.personalProblem || null,
        target_audience: data.targetAudience || null,
        target_audience_other: data.targetAudienceOther || null,
        charging: data.charging || null,
        differentiation: data.differentiation || null,
        competitors: data.competitors || [],
        user_count: data.userCount || null,
        mau: data.mau || null,
        monthly_revenue: data.monthlyRevenue || null,
        acquisition_channel: data.acquisitionChannel || null,
        revenue_range: data.revenueRange || null,
        pricing_model: data.pricingModel || null,
        pricing_model_other: data.pricingModelOther || null,
        cac: data.cac || null,
        ltv: data.ltv || null,
        team_size: data.teamSize || null,
        raised_funds: data.raisedFunds || null,
        funds_raised: data.fundsRaised || null,
        investors: data.investors || null,
        co_founder_count: data.coFounderCount || null,
      })
      .select("id")
      .single()

    if (formError) {
      console.error("Error saving validation form:", formError)
      return { id: null, error: formError.message }
    }

    const formId = formData.id

    // If we have team members, save them
    if (data.teamMembers && data.teamMembers.length > 0) {
      const teamMembersToInsert = data.teamMembers.map((member) => ({
        validation_form_id: formId,
        person: member.person,
        skills: member.skills || [],
      }))

      const { error: teamError } = await supabase.from("team_members").insert(teamMembersToInsert)

      if (teamError) {
        console.error("Error saving team members:", teamError)
        // We don't return null here because the form was saved successfully
      }
    }

    // If we have analysis results, save them
    if (analysis) {
      const { error: analysisError } = await supabase
        .from("validation_analyses")
        .insert({
          validation_form_id: formId,
          market_analysis: {
            market_size: analysis.market_analysis.market_size,
            growth_potential: analysis.market_analysis.growth_potential,
            target_audience: analysis.market_analysis.target_audience,
            competitive_landscape: analysis.market_analysis.competitive_landscape,
          },
          business_model: {
            revenue_potential: analysis.business_model.revenue_potential,
            scalability: analysis.business_model.scalability,
            sustainability: analysis.business_model.sustainability,
            risks: analysis.business_model.risks,
          },
          team_strength: {
            expertise: analysis.team_strength.expertise,
            gaps: analysis.team_strength.gaps,
            recommendations: analysis.team_strength.recommendations,
          },
          overall_assessment: {
            viability_score: analysis.overall_assessment.viability_score,
            strengths: analysis.overall_assessment.strengths,
            weaknesses: analysis.overall_assessment.weaknesses,
            recommendations: analysis.overall_assessment.recommendations,
          },
        })
        .select("id")
        .single()

      if (analysisError) {
        console.error("Error saving analysis:", analysisError)
        return { id: null, error: analysisError.message }
      }
    }

    return { id: formId, error: null }
  } catch (error) {
    console.error("Unexpected error saving validation form:", error)
    return { id: null, error: error instanceof Error ? error.message : "An unexpected error occurred" }
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
