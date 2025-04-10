import { supabase } from "./client"
import { createServerSupabaseClient } from "./server"
import type { ValidationFormValues } from "@/features/validation/schemas/validation-form-schema"
import type { ValidationFormRecord, TeamMemberRecord, ValidationWithTeamMembers } from "./types"

// Client-side functions
export async function saveValidationForm(
  data: Partial<ValidationFormValues>,
  formType: "general" | "advanced",
): Promise<string | null> {
  try {
    // First, save the validation form
    const { data: formData, error: formError } = await supabase
      .from("validation_forms")
      .insert({
        form_type: formType,
        business_idea: data.businessIdea,
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
      return null
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

    return formId
  } catch (error) {
    console.error("Unexpected error saving validation form:", error)
    return null
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

export async function getValidationFormWithTeamMembers(id: string): Promise<ValidationWithTeamMembers | null> {
  const supabaseServer = createServerSupabaseClient()

  // Get the validation form
  const { data: formData, error: formError } = await supabaseServer
    .from("validation_forms")
    .select("*")
    .eq("id", id)
    .single()

  if (formError) {
    console.error("Error fetching validation form:", formError)
    return null
  }

  // Get the team members
  const { data: teamData, error: teamError } = await supabaseServer
    .from("team_members")
    .select("*")
    .eq("validation_form_id", id)

  if (teamError) {
    console.error("Error fetching team members:", teamError)
    return null
  }

  return {
    ...(formData as ValidationFormRecord),
    team_members: teamData as TeamMemberRecord[],
  }
}
