import { ReportData } from "../supabase/types"

export const getInvestorReportPrompt = (
  businessIdea: string,
  formData: Record<string, any> = {},
  teamMembers: Array<{ person: string; skills: string[] }> = []
): string => {
  return `
You are a professional startup analyst and investor. Your role is to analyze the following startup idea and provide a detailed, structured investor report.

Business Idea:
${businessIdea}

${formData ? `
Additional Information:
${Object.entries(formData)
  .filter(([key, val]) => val !== undefined && val !== null && key !== 'businessIdea')
  .map(([key, val]) => `- ${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
  .join('\n')}
` : ''}

${teamMembers.length > 0 ? `
Team Members:
${teamMembers.map(member => `- ${member.person}: ${member.skills.join(', ')}`).join('\n')}
` : ''}

Analyze this startup idea as if you're preparing a VC investment memo. Your report should be structured, data-driven, and provide clear metrics and insights.

For the analysis, create a comprehensive report that follows professional venture capital frameworks (Y Combinator, a16z, Sequoia Capital).

You MUST return ONLY a valid JSON object that matches the following structure exactly:

{
  "business_type": string, // E.g. "SaaS", "Marketplace", "Consumer App"
  "overall_score": number, // 0-100 score representing overall investment potential
  "feasibility": string, // E.g. "✅ Buildable", "⚠️ Challenging"
  "investor_readiness": string, // E.g. "🟢 High", "🟡 Moderate", "🔴 Low"
  "estimated_valuation": string, // E.g. "$500K - $1M"
  
  "user_input": string, // The original business idea
  "ai_interpretation": string, // Your cleaned up interpretation 
  
  "summary_metrics": {
    "overall_score": number, // Same as top-level score
    "feasibility": string, // E.g. "✅ Buildable", "⚠️ Challenging"
    "time_to_mvp": string, // E.g. "4-8 weeks"
    "investor_readiness": string, // E.g. "🟢 High", "🟡 Moderate", "🔴 Low"
    "pre_rev_valuation": string // E.g. "$500K - $1M"
  },
  "frameworks_used": string[], // E.g. ["YC", "a16z", "Sequoia"]
  
  "problem": {
    "summary": string, // One-line problem summary
    "clarity_status": string, // Must be one of: "Clear", "Vague", "Not identified"
    "pain_severity": number, // 1-10 scale
    "alternatives": string[], // Current solutions and workarounds
    "ai_summary": string // 3-5 sentence explanation
  },
  
  "target_audience": {
    "segments": string[], // E.g. ["Solo Founder", "Indie Hacker"]
    "motivation": string, // Why this audience needs the solution
    "buyer_user_table": {
      "buyer": string, // Who pays
      "user": string // Who uses
    },
    "persona_suggestions": string[] // Detailed persona descriptions
  },
  
  "market": {
    "tam": number, // Total Available Market in dollars
    "sam": number, // Serviceable Available Market in dollars
    "som": number, // Serviceable Obtainable Market in dollars
    "trends": string[], // Key market trends
    "why_now": string // Why this is the right time for this product
  },
  
  "competition": {
    "competitors": [
      {
        "name": string,
        "strengths": string,
        "weaknesses": string,
        "price": string // Optional
      }
    ],
    "moat_status": string, // Must be one of: "Strong", "Moderate", "Weak"
    "positioning": {
      "x_axis": number, // 1-10 on customization axis
      "y_axis": number // 1-10 on trust axis
    }
  },
  
  "uvp": {
    "one_liner": string, // Single sentence value proposition
    "before_after": {
      "before": string, // User situation before
      "after": string // User situation after
    },
    "rating": number // 1-10 UVP strength rating
  },
  
  "business_model": {
    "pricing_tiers": [
      {
        "name": string, // E.g. "Free", "Pro"
        "price": string, // E.g. "$0", "$29/mo"
        "features": string[]
      }
    ],
    "revenue_estimation": string, // E.g. "$10K-50K MRR in first year"
    "upsell_suggestions": string[] // Additional revenue opportunities
  },
  
  "customer_validation": {
    "status": {
      "landing_page": boolean,
      "waitlist": boolean,
      "interviews": boolean
    },
    "best_quote": string, // Example of customer feedback
    "feedback_stats": {
      "signups": number,
      "feedback_rate": number // Percentage
    }
  },
  
  "pricing": {
    "roi_match": number, // 1-10 score of value vs. price alignment
    "models": string[], // E.g. ["Freemium", "Usage-Based"]
    "suggestions": string[] // Pricing strategy improvements
  },
  
  "legal": {
    "risks": string[], // Legal considerations
    "current_state": {
      "Terms of Service": boolean,
      "Privacy Policy": boolean
    },
    "disclaimer_links": {
      "Terms": string, // URL
      "Privacy": string // URL
    }
  },
  
  "metrics": {
    "success_rate": string, // E.g. "75-80%"
    "investment_score": number, // 0-100
    "breakeven_point": string, // E.g. "8 months"
    "cac": string, // Customer Acquisition Cost, E.g. "$25-40"
    "ltv": string, // Lifetime Value, E.g. "$240"
    "roi_year1": string, // E.g. "3.2x"
    "market_size_som": string, // E.g. "$10M"
    "scalability_index": number, // 0-100
    "mvp_cost": string // E.g. "$1,800"
  },
  
  "vc_methodologies": {
    // VC firm names as keys with focus areas as values
    "Y Combinator": string,
    "a16z": string,
    "Sequoia": string
  },
  
  "recommendation": {
    "summary": string, // Overall recommendation
    "next_steps": [
      {
        "task": string,
        "completed": boolean
      }
    ]
  }
}

Be extremely data-driven in your analysis. Invent reasonable numbers for market sizes, customer metrics, etc., but make them realistic based on the information provided. Use specific formatting for values:
- All dollar amounts should include the $ symbol
- Use K, M, and B for thousands, millions, and billions
- Use ranges when appropriate (e.g., "$500K-$1M")
- All percentages should include the % symbol
- Use emoji indicators (🟢, 🟡, 🔴, ✅, ⚠️) for status labels

Return ONLY the JSON object. Do not include any other text, explanations, or markdown.
Ensure your JSON is valid, with no trailing commas, and properly quoted keys and string values.
`
}

export const parseReportDataResponse = (response: string): ReportData | null => {
  try {
    // Find the first { and last } to extract the JSON
    const startIndex = response.indexOf('{')
    const endIndex = response.lastIndexOf('}') + 1
    
    if (startIndex === -1 || endIndex === 0) {
      console.error('No JSON object found in response')
      return null
    }
    
    const jsonString = response.substring(startIndex, endIndex)
    
    // Debug the JSON string before parsing
    console.log(`Extracted JSON string length: ${jsonString.length}`);
    
    // Parse the extracted JSON
    const reportData = JSON.parse(jsonString) as ReportData
    
    // Add timestamps if not present
    if (!reportData.created_at) {
      reportData.created_at = new Date().toISOString()
    }
    
    if (!reportData.updated_at) {
      reportData.updated_at = new Date().toISOString()
    }
    
    // Ensure user_input is present and correct
    if (!reportData.user_input) {
      console.warn('user_input is missing in report data, setting to original business idea');
      // This is a critical field that must not be empty
      reportData.user_input = "The business idea was not properly captured. Please check the original submission."
    } else {
      console.log(`user_input length in report data: ${reportData.user_input.length}`);
    }
    
    return reportData
  } catch (error) {
    console.error('Error parsing report data response:', error)
    return null
  }
} 