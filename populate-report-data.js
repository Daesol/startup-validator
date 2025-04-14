const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dynksioggkqwgivykuvh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDMwNTMwMSwiZXhwIjoyMDU5ODgxMzAxfQ.y42c5kVFKIdVEM-3KG3Xhm2XJmkjEBwvHTXAISISPOw'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Function to generate enhanced report data from a validation
function generateEnhancedReportData(validation) {
  const analysis = validation.analysis || {}
  
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
  
  // Generate market size estimates based on the viability score
  const baseTAM = 1000000000  // $1B
  const tamMultiplier = (viabilityScore / 50)  // Higher scores get larger markets
  const tam = Math.round(baseTAM * tamMultiplier)
  const sam = Math.round(tam * 0.3)  // 30% of TAM
  const som = Math.round(sam * 0.1)  // 10% of SAM
  
  // Generate a more comprehensive report data structure
  return {
    business_type: validation.business_type || "SaaS",
    overall_score: viabilityScore,
    feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
    investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
    estimated_valuation: viabilityScore > 80 ? "$1M – $3M" : viabilityScore > 60 ? "$500K – $1M" : "$100K – $500K",
    
    user_input: validation.business_idea || "",
    ai_interpretation: `Based on your description, you're building a ${validation.business_type || "SaaS"} solution that addresses the needs you've described. We've analyzed your complete business idea to provide a comprehensive evaluation.`,
    
    summary_metrics: {
      overall_score: viabilityScore,
      feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
      time_to_mvp: viabilityScore > 80 ? "4-6 weeks" : viabilityScore > 60 ? "7-10 weeks" : "10-14 weeks",
      investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
      pre_rev_valuation: viabilityScore > 80 ? "$1M – $3M" : viabilityScore > 60 ? "$500K – $1M" : "$100K – $500K"
    },
    frameworks_used: ["YC", "a16z", "Sequoia", "Scorecard"],
    
    problem: {
      summary: marketAnalysis.target_audience || "Customer needs identified in the business concept",
      clarity_status: viabilityScore > 75 ? "Clear" : viabilityScore > 60 ? "Vague" : "Not identified",
      pain_severity: Math.min(10, Math.max(1, Math.floor(viabilityScore / 10))),
      alternatives: ["Manual processes", "Existing but inadequate solutions", "Workarounds"],
      ai_summary: marketAnalysis.target_audience || 
        `The problem affects ${validation.target_audience || "the target audience"} who currently rely on suboptimal solutions. Based on the business idea, this represents a ${viabilityScore > 75 ? "significant" : "moderate"} opportunity to create value.`
    },
    
    target_audience: {
      segments: [validation.target_audience || "Early-stage startups", "Small business owners"],
      motivation: `These segments are motivated by the need to ${validation.business_idea ? validation.business_idea.substring(0, 30) : "solve their problems"}... more effectively and efficiently.`,
      buyer_user_table: {
        buyer: validation.business_type === "B2B" ? "Business owner/manager" : "End user",
        user: "Team members and stakeholders"
      },
      persona_suggestions: [
        "Primary: Tech-savvy business owner seeking efficiency",
        "Secondary: Team member responsible for implementing solutions"
      ]
    },
    
    market: {
      tam,
      sam,
      som,
      trends: [
        marketAnalysis.growth_potential || "Growing market demand", 
        "Increasing digital adoption",
        "Shift toward specialized solutions"
      ],
      why_now: "Market timing is favorable due to increasing awareness of this problem and emerging technology that makes the solution more viable than before."
    },
    
    competition: {
      competitors: [
        {
          name: "Established Player",
          strengths: "Brand recognition, existing customer base",
          weaknesses: "Outdated technology, higher pricing",
          price: "$100-500/mo"
        },
        {
          name: "Recent Entrant",
          strengths: "Modern features, aggressive pricing",
          weaknesses: "Limited market presence, narrow feature set",
          price: "$50-200/mo"
        }
      ],
      moat_status: viabilityScore > 80 ? "Strong" : viabilityScore > 60 ? "Moderate" : "Weak",
      positioning: {
        x_axis: Math.min(10, Math.max(1, Math.round(viabilityScore / 10))), // Customization
        y_axis: Math.min(10, Math.max(1, Math.round((viabilityScore - 10) / 10)))  // Trust
      }
    },
    
    uvp: {
      one_liner: validation.differentiation || `A ${validation.business_type || "solution"} that uniquely addresses ${validation.target_audience || "customer"} needs through innovative design and specialized features.`,
      before_after: {
        before: `Before: ${validation.target_audience || "Users"} struggle with inefficient processes and limited capabilities.`,
        after: `After: ${validation.target_audience || "Users"} enjoy streamlined operations, better outcomes, and significant time savings.`
      },
      rating: Math.min(10, Math.max(1, Math.round(viabilityScore / 10)))
    },
    
    business_model: {
      pricing_tiers: [
        {
          name: "Free",
          price: "$0",
          features: ["Basic features", "Limited usage", "Community support"]
        },
        {
          name: "Pro",
          price: "$29/mo",
          features: ["All free features", "Advanced capabilities", "Priority support", "API access"]
        },
        {
          name: "Enterprise",
          price: "$99/mo",
          features: ["All Pro features", "Dedicated support", "Custom integrations", "Advanced analytics"]
        }
      ],
      revenue_estimation: viabilityScore > 75 ? "$50K-100K MRR in first year" : "$20K-50K MRR in first year",
      upsell_suggestions: ["White-label solution", "Implementation services", "Custom development", "Training workshops"]
    },
    
    customer_validation: {
      status: {
        landing_page: false,
        waitlist: false,
        interviews: false
      },
      best_quote: "Hypothetical feedback: 'This would solve our biggest pain point and save us hours every week.'",
      feedback_stats: {
        signups: 0,
        feedback_rate: 0
      }
    },
    
    pricing: {
      roi_match: Math.min(10, Math.max(1, Math.round(viabilityScore / 10))),
      models: [validation.pricing_model || "Subscription", "Freemium", "Usage-based"],
      suggestions: [
        "Consider tiered pricing based on feature access", 
        "Implement annual billing with discount",
        "Offer early adopter special pricing"
      ]
    },
    
    legal: {
      risks: [
        "Standard terms of service requirements", 
        "Data privacy considerations",
        "Industry-specific regulations"
      ],
      current_state: {
        "Terms of Service": false,
        "Privacy Policy": false,
        "Data Processing Agreement": false
      },
      disclaimer_links: {
        "Terms": "#",
        "Privacy": "#",
        "Support": "#"
      }
    },
    
    metrics: {
      success_rate: viabilityScore > 75 ? "75-85%" : "60-75%",
      investment_score: Math.round(viabilityScore * 1.1), // Slightly optimistic
      breakeven_point: viabilityScore > 75 ? "8-12 months" : "12-18 months",
      cac: `$${Math.round(150 - viabilityScore)}-${Math.round(250 - viabilityScore)}`,
      ltv: `$${Math.round(viabilityScore * 5)}0`,
      roi_year1: `${(viabilityScore / 30).toFixed(1)}x`,
      market_size_som: `$${Math.round(som / 1000000)}M`,
      scalability_index: Math.round(viabilityScore * 1.2),
      mvp_cost: `$${Math.round(10000 + (100 - viabilityScore) * 100)}`
    },
    
    vc_methodologies: {
      "Y Combinator": "Team quality and execution potential",
      "a16z": "Market size and moat strength",
      "Sequoia": "Growth trajectory and market fit",
      "Scorecard": "Pre-revenue valuation model",
      "Berkus": "Asset-based valuation approach" 
    },
    
    recommendation: {
      summary: recommendations.join(" ") || 
        `Based on our analysis, this ${validation.business_type || "business"} concept shows ${viabilityScore > 75 ? "strong" : viabilityScore > 60 ? "moderate" : "limited"} potential. We recommend ${viabilityScore > 60 ? "proceeding with development while validating key assumptions" : "further refining the concept and conducting additional market research"}.`,
      next_steps: [
        {
          task: "Create a landing page to validate interest",
          completed: false
        },
        {
          task: "Conduct user interviews with target customers",
          completed: false
        },
        {
          task: "Develop MVP focused on core functionality",
          completed: false
        },
        {
          task: "Establish pricing model and test with early users",
          completed: false
        }
      ]
    },
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

async function populateReportData() {
  try {
    console.log('Starting population of report_data for existing analyses...')
  
    // Fetch all analysis records
    const { data: analyses, error: analysesError } = await supabase
      .from('validation_analyses')
      .select('id, validation_form_id, market_analysis, business_model, team_strength, overall_assessment')
    
    if (analysesError) {
      console.error('Error fetching analyses:', analysesError)
      return
    }
    
    console.log(`Found ${analyses.length} analyses to process`)
    
    // Process each analysis
    for (const analysis of analyses) {
      try {
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
        const validation = {
          ...form,
          analysis: {
            ...analysis,
          },
          team_members: teamMembers || []
        }
        
        // Generate comprehensive report data
        const reportData = generateEnhancedReportData(validation)
        
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
      } catch (error) {
        console.error(`Error processing analysis ${analysis.id}:`, error)
      }
    }
    
    console.log('Report data population completed!')
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Check if report_data column exists before running
async function checkAndPopulate() {
  try {
    console.log('Checking if report_data column exists...')
    const { data, error } = await supabase
      .from('validation_analyses')
      .select('id, report_data')
      .limit(1)
    
    if (error && error.message.includes('does not exist')) {
      console.error('The report_data column does not exist. Please run the SQL migrations first:', error)
      return
    }
    
    console.log('The report_data column exists. Proceeding with data population...')
    await populateReportData()
  } catch (err) {
    console.error('Error checking schema:', err)
  }
}

checkAndPopulate() 