import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { analyzeBusiness } from "@/lib/ai/business-analyzer"
import { validationFormSchema } from "@/features/validation/schemas/validation-form-schema"

// Maximum number of retries for AI analysis
const MAX_RETRIES = 2

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        { error: "Failed to initialize database connection" },
        { status: 500 }
      )
    }
    
    // Parse FormData
    const formData = await request.formData()
    const businessIdea = formData.get("businessIdea") as string
    const websiteUrl = formData.get("websiteUrl") as string | null

    // Validate required fields
    if (!businessIdea || businessIdea.trim() === "") {
      return NextResponse.json(
        { error: "Business idea is required" },
        { status: 400 }
      )
    }

    // Format the data for analysis
    const formDataForAnalysis = {
      businessIdea,
      website: websiteUrl || "",
      businessStage: "",
      businessType: "",
      personalProblem: false,
      targetAudience: "",
      targetAudienceOther: "",
      charging: false,
      differentiation: "",
      competitors: [],
      userCount: "",
      mau: "",
      monthlyRevenue: "",
      acquisitionChannel: "",
      revenueRange: "",
      pricingModel: "",
      pricingModelOther: "",
      cac: "",
      ltv: "",
      teamSize: "",
      raisedFunds: false,
      fundsRaised: "",
      investors: "",
      coFounderCount: "",
      teamMembers: [],
    }

    // First, save the form data to get an ID
    const { data: formRecord, error: formError } = await supabase
      .from("validation_forms")
      .insert({
        form_type: "general",
        business_idea: businessIdea,
        website: websiteUrl || null,
        business_stage: null,
        business_type: null,
        personal_problem: null,
        target_audience: null,
        target_audience_other: null,
        charging: null,
        differentiation: null,
        competitors: [],
        user_count: null,
        mau: null,
        monthly_revenue: null,
        acquisition_channel: null,
        revenue_range: null,
        pricing_model: null,
        pricing_model_other: null,
        cac: null,
        ltv: null,
        team_size: null,
        raised_funds: null,
        funds_raised: null,
        investors: null,
        co_founder_count: null,
      })
      .select("id")
      .single()

    if (formError) {
      console.error("Error saving form:", formError)
      return NextResponse.json(
        { error: "Failed to save form data", details: formError.message },
        { status: 500 }
      )
    }

    // Save team members if any
    if (formData.getAll("teamMembers").length > 0) {
      const teamMembersToInsert = formData.getAll("teamMembers").map((member) => ({
        validation_form_id: formRecord.id,
        person: member as string,
        skills: [],
      }))

      const { error: teamError } = await supabase
        .from("team_members")
        .insert(teamMembersToInsert)

      if (teamError) {
        console.error("Error saving team members:", teamError)
        // Continue with analysis even if team members save fails
      }
    }

    // Create an empty analysis record first to indicate we're processing
    const { error: emptyAnalysisError } = await supabase
      .from("validation_analyses")
      .insert({
        validation_form_id: formRecord.id,
        market_analysis: {},
        business_model: {},
        team_strength: {},
        overall_assessment: {},
        report_data: null
      })

    if (emptyAnalysisError) {
      console.error("Error creating empty analysis:", emptyAnalysisError)
      // Continue anyway to try the analysis
    }

    // Perform AI analysis with retries
    let analysis = null
    let lastError = null
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // If not the first attempt, add a small delay
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)) // Exponential backoff
        }
        
        analysis = await analyzeBusiness(formDataForAnalysis)
        if (analysis) break // Successfully got analysis, exit retry loop
      } catch (error) {
        console.error(`Analysis attempt ${attempt + 1} failed:`, error)
        lastError = error
      }
    }
    
    // If all attempts failed, return error but keep the form ID
    if (!analysis) {
      return NextResponse.json(
        { 
          error: "Failed to analyze business idea after multiple attempts", 
          details: lastError instanceof Error ? lastError.message : "Unknown error",
          formId: formRecord.id // Return the form ID anyway so client can retry later
        },
        { status: 500 }
      )
    }

    // Update the analysis record with actual data
    const { error: analysisError } = await supabase
      .from("validation_analyses")
      .update({
        market_analysis: analysis.market_analysis,
        business_model: analysis.business_model,
        team_strength: analysis.team_strength,
        overall_assessment: analysis.overall_assessment,
        report_data: analysis.report_data || null
      })
      .eq("validation_form_id", formRecord.id)

    if (analysisError) {
      console.error("Error saving analysis:", analysisError)
      return NextResponse.json(
        { 
          error: "Failed to save analysis", 
          details: analysisError.message,
          formId: formRecord.id // Return the form ID anyway
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      formId: formRecord.id,
      analysis: analysis
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 