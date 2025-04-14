#!/usr/bin/env ts-node
/**
 * Script to populate the report_data field for existing records in the validation_analyses table
 * 
 * Run with: npx ts-node src/scripts/populate-report-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { ValidationWithAnalysis, ReportData } from '@/lib/supabase/types'
import type { Database } from '@/lib/supabase/database.types'

config() // Load .env file

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key')
  process.exit(1)
}

// Create Supabase client with service role key (more permissions)
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function populateReportData() {
  console.log('Starting population of report_data for existing analyses...')
  
  // Fetch all analysis records that don't have report_data
  const { data: analyses, error: analysesError } = await supabase
    .from('validation_analyses')
    .select('id, validation_form_id, market_analysis, business_model, team_strength, overall_assessment')
    .is('report_data', null)
  
  if (analysesError) {
    console.error('Error fetching analyses:', analysesError)
    process.exit(1)
  }
  
  console.log(`Found ${analyses.length} analyses to update`)
  
  // Process each analysis
  for (const analysis of analyses) {
    // Fetch the corresponding validation form
    const { data: form, error: formError } = await supabase
      .from('validation_forms')
      .select('*')
      .eq('id', analysis.validation_form_id)
      .single()
    
    if (formError) {
      console.error(`Error fetching form ${analysis.validation_form_id}:`, formError)
      continue
    }
    
    // Fetch team members
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('*')
      .eq('validation_form_id', analysis.validation_form_id)
    
    if (teamError) {
      console.warn(`Error fetching team members for ${analysis.validation_form_id}:`, teamError)
      // Continue without team members
    }
    
    // Create the validation with analysis object
    const validation: ValidationWithAnalysis = {
      ...form,
      analysis: {
        ...analysis,
        created_at: '',  // These will be populated by the generator
        updated_at: '',
        id: analysis.id,
        validation_form_id: analysis.validation_form_id
      },
      team_members: teamMembers || []
    }
    
    // Generate report data
    const reportData = generateReportData(validation)
    
    // Update the analysis record with the new report_data
    const { error: updateError } = await supabase
      .from('validation_analyses')
      .update({ report_data: reportData })
      .eq('id', analysis.id)
    
    if (updateError) {
      console.error(`Error updating analysis ${analysis.id}:`, updateError)
      continue
    }
    
    console.log(`Successfully updated analysis ${analysis.id}`)
  }
  
  console.log('Report data population completed!')
}

// Function to generate report data from a validation
function generateReportData(validation: ValidationWithAnalysis): ReportData {
  const { analysis } = validation
  
  // Ensure we have proper objects, not null
  const marketAnalysis = analysis.market_analysis || {}
  const businessModel = analysis.business_model || {}
  const teamStrength = analysis.team_strength || {}
  const overallAssessment = analysis.overall_assessment || {}
  
  // Ensure viability_score exists and is a number
  const viabilityScore = typeof overallAssessment.viability_score === 'number' 
    ? overallAssessment.viability_score 
    : 70 // Default score
  
  // Ensure strengths, weaknesses, and recommendations are arrays
  const strengths = Array.isArray(overallAssessment.strengths) 
    ? overallAssessment.strengths 
    : ['Strong business concept']
  
  const weaknesses = Array.isArray(overallAssessment.weaknesses) 
    ? overallAssessment.weaknesses 
    : ['Needs further validation']
  
  const recommendations = Array.isArray(overallAssessment.recommendations) 
    ? overallAssessment.recommendations 
    : ['Develop an MVP to test with actual users']
  
  // Generate a default report data structure
  return {
    business_type: validation.business_type || "Startup",
    overall_score: viabilityScore,
    feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
    investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
    estimated_valuation: "$500K – $1M", // Placeholder
    
    user_input: validation.business_idea,
    ai_interpretation: `Based on your description, you're building ${validation.business_idea.substring(0, 100)}...`,
    
    summary_metrics: {
      overall_score: viabilityScore,
      feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
      time_to_mvp: "4-8 weeks", // Placeholder
      investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
      pre_rev_valuation: "$500K – $1M" // Placeholder
    },
    frameworks_used: ["YC", "a16z", "Sequoia"], // Placeholder
    
    problem: {
      summary: "Problem identification based on business idea",
      clarity_status: viabilityScore > 75 ? "Clear" : "Needs Refinement",
      pain_severity: Math.floor(viabilityScore / 10),
      alternatives: ["Existing solutions"], // Placeholder
      ai_summary: marketAnalysis.target_audience || "The problem affects the target audience."
    },
    
    target_audience: {
      segments: [validation.target_audience || "Early adopters"],
      motivation: "Seeking solution to their problems", // Placeholder
      buyer_user_table: {
        buyer: "Decision maker",
        user: "End user"
      },
      persona_suggestions: ["Primary user persona"] // Placeholder
    },
    
    market: {
      tam: 0, // Placeholder
      sam: 0, // Placeholder
      som: 0, // Placeholder
      trends: [marketAnalysis.growth_potential || "Growing market"],
      why_now: "The timing is right due to market conditions" // Placeholder
    },
    
    competition: {
      competitors: [{
        name: "Competitor 1",
        strengths: "Established brand",
        weaknesses: "Higher pricing"
      }],
      moat_status: "Moderate",
      positioning: {
        x_axis: 7, // Customization
        y_axis: 6  // Trust
      }
    },
    
    uvp: {
      one_liner: validation.differentiation || "Unique value proposition",
      before_after: {
        before: "Before: Challenge faced",
        after: "After: Problem solved"
      },
      rating: Math.floor(viabilityScore / 10)
    },
    
    business_model: {
      pricing_tiers: [
        {
          name: "Free",
          price: "$0",
          features: ["Basic features"]
        },
        {
          name: "Pro",
          price: "$29/mo",
          features: ["Advanced features"]
        }
      ],
      revenue_estimation: "$10K-50K MRR in first year", // Placeholder
      upsell_suggestions: ["Enterprise tier", "Add-on services"]
    },
    
    customer_validation: {
      status: {
        landing_page: false,
        waitlist: false,
        interviews: false
      },
      best_quote: "From customer interviews", // Placeholder
      feedback_stats: {
        signups: 0,
        feedback_rate: 0
      }
    },
    
    pricing: {
      roi_match: 8, // 1-10 scale
      models: [validation.pricing_model || "Subscription"],
      suggestions: ["Consider tiered pricing"]
    },
    
    legal: {
      risks: ["Standard compliance requirements"],
      current_state: {
        "Terms of Service": false,
        "Privacy Policy": false
      },
      disclaimer_links: {
        "Terms": "#",
        "Privacy": "#"
      }
    },
    
    metrics: {
      success_rate: "75-80%",
      investment_score: 84,
      breakeven_point: "8 months",
      cac: validation.cac || "$25-40",
      ltv: validation.ltv || "$240",
      roi_year1: "3.2x",
      market_size_som: "$10M", // Placeholder
      scalability_index: 87,
      mvp_cost: "$1,800" // Placeholder
    },
    
    vc_methodologies: {
      "Y Combinator": "Team, traction",
      "a16z": "Moat, market fit",
      "Sequoia": "Market clarity"
    },
    
    recommendation: {
      summary: recommendations.join(" ") || "Based on our analysis, we recommend proceeding with caution.",
      next_steps: [
        {
          task: "Launch MVP",
          completed: false
        },
        {
          task: "Run user interviews",
          completed: false
        },
        {
          task: "Prepare pitch for investors",
          completed: false
        }
      ]
    },
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

// Run the migration
populateReportData().catch(console.error) 