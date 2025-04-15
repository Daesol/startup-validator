"use strict";exports.id=284,exports.ids=[284],exports.modules={52284:(e,t,s)=>{s.d(t,{pW:()=>o});var i=s(52035);let r=(e,t={},s=[])=>`
You are a professional startup analyst and investor. Your role is to analyze the following startup idea and provide a detailed, structured investor report.

Business Idea:
${e}

${t?`
Additional Information:
${Object.entries(t).filter(([e,t])=>null!=t&&"businessIdea"!==e).map(([e,t])=>`- ${e}: ${Array.isArray(t)?t.join(", "):t}`).join("\n")}
`:""}

${s.length>0?`
Team Members:
${s.map(e=>`- ${e.person}: ${e.skills.join(", ")}`).join("\n")}
`:""}

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
`,n=e=>{try{let t=e.indexOf("{"),s=e.lastIndexOf("}")+1;if(-1===t||0===s)return console.error("No JSON object found in response"),null;let i=e.substring(t,s);console.log(`Extracted JSON string length: ${i.length}`);let r=JSON.parse(i);return r.created_at||(r.created_at=new Date().toISOString()),r.updated_at||(r.updated_at=new Date().toISOString()),r.user_input?console.log(`user_input length in report data: ${r.user_input.length}`):(console.warn("user_input is missing in report data, setting to original business idea"),r.user_input="The business idea was not properly captured. Please check the original submission."),r}catch(e){return console.error("Error parsing report data response:",e),null}},a=new i.Ay({apiKey:process.env.OPENAI_API_KEY});async function o(e,t=!0){let s=function(e){let t="website"in e,s="businessStage"in e;if(t||!s){let s=t?e.website:e.websiteUrl;return`Analyze this startup idea and provide a detailed validation report in JSON format:

Business Idea: ${e.businessIdea}
Website: ${s||"Not provided"}

Please provide a comprehensive analysis in the following JSON structure:
{
  "market_analysis": {
    "market_size": "string",
    "growth_potential": "string",
    "target_audience": "string",
    "competitive_landscape": "string"
  },
  "business_model": {
    "revenue_potential": "string",
    "scalability": "string",
    "sustainability": "string",
    "risks": "string"
  },
  "team_strength": {
    "expertise": "string",
    "gaps": "string",
    "recommendations": "string"
  },
  "overall_assessment": {
    "viability_score": number,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"]
  }
}`}return`Analyze this startup idea and provide a detailed validation report in JSON format:

Business Idea: ${e.businessIdea}
Website: ${e.websiteUrl||"Not provided"}
Business Stage: ${e.businessStage||"Not specified"}
Business Type: ${e.businessType||"Not specified"}

Target Audience: ${e.targetAudience||"Not specified"}
${e.targetAudienceOther?`Additional Target Audience: ${e.targetAudienceOther}`:""}

Problem Being Solved: ${e.personalProblem||"Not specified"}
Revenue Model: ${e.charging||"Not specified"}
Differentiation: ${e.differentiation||"Not specified"}
Competitors: ${e.competitors?.join(", ")||"Not specified"}

Metrics:
- Users: ${e.userCount||"Not specified"}
- MAU: ${e.mau||"Not specified"}
- Monthly Revenue: ${e.monthlyRevenue||"Not specified"}
- CAC: ${e.cac||"Not specified"}
- LTV: ${e.ltv||"Not specified"}

Team:
- Size: ${e.teamSize||"Not specified"}
- Co-founders: ${e.coFounderCount||"Not specified"}
${e.teamMembers?.map(e=>`- ${e.person}: ${e.skills.join(", ")}`).join("\n")||""}

Funding:
- Raised: ${e.raisedFunds?"Yes":"No"}
- Amount: ${e.fundsRaised||"Not specified"}
- Investors: ${e.investors||"Not specified"}

Please provide a comprehensive analysis in the following JSON structure:
{
  "market_analysis": {
    "market_size": "string",
    "growth_potential": "string",
    "target_audience": "string",
    "competitive_landscape": "string"
  },
  "business_model": {
    "revenue_potential": "string",
    "scalability": "string",
    "sustainability": "string",
    "risks": "string"
  },
  "team_strength": {
    "expertise": "string",
    "gaps": "string",
    "recommendations": "string"
  },
  "overall_assessment": {
    "viability_score": number,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"]
  }
}`}(e);try{let i=(await a.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:`You are an expert startup validator with experience in venture capital and business analysis. 
          Analyze the provided startup information and generate a comprehensive validation report.
          Focus on market potential, business model viability, and team strength.
          Be critical but constructive in your analysis.`},{role:"user",content:s}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!i)throw Error("No content received from OpenAI");try{let s=JSON.parse(i);if(t){let t=await l(e);t&&(s.report_data=t)}return s}catch(e){throw console.error("Error parsing OpenAI response:",e),Error("Failed to parse analysis response")}}catch(e){throw console.error("Error analyzing business:",e),e}}async function l(e){try{let t="teamMembers"in e?e.teamMembers:[],s={...e},i=e.businessIdea;console.log(`Business idea for report generation - Type: ${typeof i}, Length: ${i?.length}`),console.log(`Business idea first 50 chars: ${i?.substring(0,50)}`);let o=r(i,s,t),l=(await a.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are an expert startup analyst specializing in creating professional investor reports. Always include the full original business idea in your output."},{role:"user",content:o}],temperature:.5,response_format:{type:"json_object"}})).choices[0].message.content;if(!l)throw Error("No content received from OpenAI for investor report");let u=n(l);return u&&u.user_input!==e.businessIdea&&(console.log("Fixing user_input in report data to match original business idea"),u.user_input=e.businessIdea),u}catch(e){return console.error("Error generating investor report data:",e),null}}}};