(()=>{var e={};e.id=786,e.ids=[786],e.modules={2507:(e,t,r)=>{"use strict";r.d(t,{z:()=>i});var s=r(86345);let i=()=>{let e="https://dynksioggkqwgivykuvh.supabase.co",t=process.env.SUPABASE_SERVICE_ROLE_KEY;return e&&t?(0,s.UU)(e,t):(console.error("Missing Supabase environment variables"),null)}},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},24851:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>y,routeModule:()=>_,serverHooks:()=>h,workAsyncStorage:()=>f,workUnitAsyncStorage:()=>v});var s={};r.r(s),r.d(s,{POST:()=>b});var i=r(96559),n=r(48088),a=r(37719),o=r(32190),l=r(2507),u=r(69905);let d=(e,t={},r=[])=>`
You are a professional startup analyst and investor. Your role is to analyze the following startup idea and provide a detailed, structured investor report.

Business Idea:
${e}

${t?`
Additional Information:
${Object.entries(t).filter(([e,t])=>null!=t&&"businessIdea"!==e).map(([e,t])=>`- ${e}: ${Array.isArray(t)?t.join(", "):t}`).join("\n")}
`:""}

${r.length>0?`
Team Members:
${r.map(e=>`- ${e.person}: ${e.skills.join(", ")}`).join("\n")}
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
`,c=e=>{try{let t=e.indexOf("{"),r=e.lastIndexOf("}")+1;if(-1===t||0===r)return console.error("No JSON object found in response"),null;let s=e.substring(t,r);console.log(`Extracted JSON string length: ${s.length}`);let i=JSON.parse(s);return i.created_at||(i.created_at=new Date().toISOString()),i.updated_at||(i.updated_at=new Date().toISOString()),i.user_input?console.log(`user_input length in report data: ${i.user_input.length}`):(console.warn("user_input is missing in report data, setting to original business idea"),i.user_input="The business idea was not properly captured. Please check the original submission."),i}catch(e){return console.error("Error parsing report data response:",e),null}},p=new u.Ay({apiKey:process.env.OPENAI_API_KEY});async function g(e,t=!0){let r=function(e){let t="website"in e,r="businessStage"in e;if(t||!r){let r=t?e.website:e.websiteUrl;return`Analyze this startup idea and provide a detailed validation report in JSON format:

Business Idea: ${e.businessIdea}
Website: ${r||"Not provided"}

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
}`}(e);try{let s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:`You are an expert startup validator with experience in venture capital and business analysis. 
          Analyze the provided startup information and generate a comprehensive validation report.
          Focus on market potential, business model viability, and team strength.
          Be critical but constructive in your analysis.`},{role:"user",content:r}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No content received from OpenAI");try{let r=JSON.parse(s);if(t){let t=await m(e);t&&(r.report_data=t)}return r}catch(e){throw console.error("Error parsing OpenAI response:",e),Error("Failed to parse analysis response")}}catch(e){throw console.error("Error analyzing business:",e),e}}async function m(e){try{let t="teamMembers"in e?e.teamMembers:[],r={...e},s=e.businessIdea;console.log(`Business idea for report generation - Type: ${typeof s}, Length: ${s?.length}`),console.log(`Business idea first 50 chars: ${s?.substring(0,50)}`);let i=d(s,r,t),n=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are an expert startup analyst specializing in creating professional investor reports. Always include the full original business idea in your output."},{role:"user",content:i}],temperature:.5,response_format:{type:"json_object"}})).choices[0].message.content;if(!n)throw Error("No content received from OpenAI for investor report");let a=c(n);return a&&a.user_input!==e.businessIdea&&(console.log("Fixing user_input in report data to match original business idea"),a.user_input=e.businessIdea),a}catch(e){return console.error("Error generating investor report data:",e),null}}async function b(e){try{let t=(0,l.z)();if(!t)return o.NextResponse.json({error:"Failed to initialize database connection"},{status:500});let r=await e.formData(),s=r.get("businessIdea"),i=r.get("websiteUrl");if(!s||""===s.trim())return o.NextResponse.json({error:"Business idea is required"},{status:400});let n={businessIdea:s,website:i||"",businessStage:"",businessType:"",personalProblem:!1,targetAudience:"",targetAudienceOther:"",charging:!1,differentiation:"",competitors:[],userCount:"",mau:"",monthlyRevenue:"",acquisitionChannel:"",revenueRange:"",pricingModel:"",pricingModelOther:"",cac:"",ltv:"",teamSize:"",raisedFunds:!1,fundsRaised:"",investors:"",coFounderCount:"",teamMembers:[]},{data:a,error:u}=await t.from("validation_forms").insert({form_type:"general",business_idea:s,website:i||null,business_stage:null,business_type:null,personal_problem:null,target_audience:null,target_audience_other:null,charging:null,differentiation:null,competitors:[],user_count:null,mau:null,monthly_revenue:null,acquisition_channel:null,revenue_range:null,pricing_model:null,pricing_model_other:null,cac:null,ltv:null,team_size:null,raised_funds:null,funds_raised:null,investors:null,co_founder_count:null}).select("id").single();if(u)return console.error("Error saving form:",u),o.NextResponse.json({error:"Failed to save form data",details:u.message},{status:500});if(r.getAll("teamMembers").length>0){let e=r.getAll("teamMembers").map(e=>({validation_form_id:a.id,person:e,skills:[]})),{error:s}=await t.from("team_members").insert(e);s&&console.error("Error saving team members:",s)}let{error:d}=await t.from("validation_analyses").insert({validation_form_id:a.id,market_analysis:{},business_model:{},team_strength:{},overall_assessment:{},report_data:null});d&&console.error("Error creating empty analysis:",d);let c=null,p=null;for(let e=0;e<=2;e++)try{if(e>0&&await new Promise(t=>setTimeout(t,2e3*e)),c=await g(n))break}catch(t){console.error(`Analysis attempt ${e+1} failed:`,t),p=t}if(!c)return o.NextResponse.json({error:"Failed to analyze business idea after multiple attempts",details:p instanceof Error?p.message:"Unknown error",formId:a.id},{status:500});let{error:m}=await t.from("validation_analyses").update({market_analysis:c.market_analysis,business_model:c.business_model,team_strength:c.team_strength,overall_assessment:c.overall_assessment,report_data:c.report_data||null}).eq("validation_form_id",a.id);if(m)return console.error("Error saving analysis:",m),o.NextResponse.json({error:"Failed to save analysis",details:m.message,formId:a.id},{status:500});return o.NextResponse.json({success:!0,formId:a.id,analysis:c})}catch(e){return console.error("Unexpected error:",e),o.NextResponse.json({error:"Internal server error",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}let _=new i.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/analyze/route",pathname:"/api/analyze",filename:"route",bundlePath:"app/api/analyze/route"},resolvedPagePath:"/Users/artfct/Documents/Software Business/startup-validator/src/app/api/analyze/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:f,workUnitAsyncStorage:v,serverHooks:h}=_;function y(){return(0,a.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:v})}},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},37830:e=>{"use strict";e.exports=require("node:stream/web")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},57075:e=>{"use strict";e.exports=require("node:stream")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,570,345,580,905],()=>r(24851));module.exports=s})();