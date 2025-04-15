(()=>{var e={};e.id=422,e.ids=[422],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},37830:e=>{"use strict";e.exports=require("node:stream/web")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},57075:e=>{"use strict";e.exports=require("node:stream")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},80416:(e,t,s)=>{"use strict";s.r(t),s.d(t,{patchFetch:()=>O,routeModule:()=>I,serverHooks:()=>x,workAsyncStorage:()=>E,workUnitAsyncStorage:()=>N});var r={};s.r(r),s.d(r,{GET:()=>S});var o=s(96559),a=s(48088),n=s(37719),i=s(32190);let l=(0,s(86345).UU)("https://dynksioggkqwgivykuvh.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDUzMDEsImV4cCI6MjA1OTg4MTMwMX0.vMMZu55NMuzra_iq3JLraanzUlWrzwXRyMQ40TeJtJ0");async function c(e,t){try{console.log(`Updating VC validation status to "${t}" for ID: ${e}`);let{error:s}=await l.from("vc_validation_analyses").update({status:t,updated_at:new Date().toISOString()}).eq("id",e);if(s)return console.error("Error updating VC validation status:",s),{success:!1,error:s.message};return{success:!0}}catch(e){return console.error("Error in updateVCValidationStatus:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}async function u(e,t,s,r,o,a,n){try{console.log(`Adding ${t} agent analysis for validation ID: ${e}`);let{data:i,error:c}=await l.from("vc_agent_analyses").insert({vc_validation_id:e,agent_type:t,input_context:s,analysis:r,score:o,reasoning:a,enhanced_context:n,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}).select("id").single();if(c)return console.error(`Error adding ${t} agent analysis:`,c),{success:!1,error:c.message};let{data:u,error:d}=await l.from("vc_validation_analyses").select("agent_responses").eq("id",e).single();d&&console.error("Error fetching current agent_responses:",d);let m=u?.agent_responses||{};m[t]=r;let{error:p}=await l.from("vc_validation_analyses").update({agent_responses:m,updated_at:new Date().toISOString()}).eq("id",e);return p&&console.error(`Error updating agent_responses with ${t} analysis:`,p),console.log(`Added ${t} agent analysis with ID: ${i.id}`),{success:!0,analysisId:i.id}}catch(e){return console.error("Error in addAgentAnalysis:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}async function d(e,t,s){try{let r;console.log(`Setting final VC report for validation ID: ${e}`),r="string"==typeof s?Math.round(parseFloat(s)):Math.round(s),console.log(`Parsed overall score: ${r} (original: ${s})`);let{error:o}=await l.from("vc_validation_analyses").update({vc_report:t,score:r,status:"completed",updated_at:new Date().toISOString()}).eq("id",e);if(o)return console.error("Error setting VC report:",o),{success:!1,error:o.message};return{success:!0}}catch(e){return console.error("Error in setVCReport:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}async function m(e){try{console.log(`Fetching VC validation with analyses for ID: ${e}`);let{data:t,error:s}=await l.from("vc_validation_analyses").select("*").eq("id",e).maybeSingle();if(!t){console.log(`No VC validation found with ID ${e}, trying to find by form ID`);let{data:s,error:r}=await l.from("vc_validation_analyses").select("*").eq("validation_form_id",e).maybeSingle();if(r&&"PGRST116"!==r.code)return console.error("Error fetching VC validation by form ID:",r),{success:!1,error:r.message};if(s)t=s,console.log(`Found VC validation with form ID ${e}`);else{console.log("No match found, trying to fetch the most recent validation");let{data:e,error:s}=await l.from("vc_validation_analyses").select("*").order("created_at",{ascending:!1}).limit(1).maybeSingle();if(s)console.error("Error fetching recent validation:",s);else{if(!e)return console.error("No VC validation found with this ID or form ID"),{success:!1,error:"No VC validation found"};console.log(`Found most recent validation with ID: ${e.id}, form ID: ${e.validation_form_id}`),t=e}}}if(!t)return{success:!1,error:"No VC validation found with any of the attempted methods"};let{data:r,error:o}=await l.from("validation_forms").select("*").eq("id",t.validation_form_id).single();if(o)return console.error("Error fetching validation form:",o),{success:!1,error:o.message};let{data:a,error:n}=await l.from("vc_agent_analyses").select("*").eq("vc_validation_id",t.id).order("created_at",{ascending:!0});if(n)return console.error("Error fetching agent analyses:",n),{success:!1,error:n.message};console.log(`Validation state - ID: ${t.id}, Form ID: ${t.validation_form_id}, Status: ${t.status}, Agents: ${a?.length||0}`);let i={form:r,validation:t,agent_analyses:a||[]};return{success:!0,data:i}}catch(e){return console.error("Error in getVCValidationWithAnalyses:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}let p=new(s(69905)).Ay({apiKey:process.env.OPENAI_API_KEY});async function g(e,t={},s){let r=Date.now(),o=()=>{let e=Math.round((Date.now()-r)/1e3);return`[${e}s]`};try{console.log(`${o()} Starting VC validation for business idea:`,e.substring(0,100));let a=e.trim();if(a.length<10)return{success:!1,error:"Business idea is too short for meaningful analysis",failed_at:"input_validation",error_details:{business_idea_length:a.length}};let n={user_input:a,...t},i={problem:null,market:null,competitive:null,uvp:null,business_model:null,validation:null,legal:null,metrics:null,vc_lead:null,market_fit:null,competition:null,team:null,financials:null,traction:null,investor_readiness:null},l=[],c=[];try{console.log(`${o()} Starting Problem Agent analysis`);let e=await _(n);i.problem=e,n={...n,problem_analysis:e,enhanced_problem_statement:e.improved_problem_statement},console.log(`${o()} Problem analysis completed, score:`,e.score),l.push("problem"),s&&await s("problem",e)}catch(t){let e=`Problem Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("problem"),n.enhanced_problem_statement=a;try{s&&await s("problem",{improved_problem_statement:a,severity_index:5,problem_framing:"global",root_causes:["Analysis could not be completed"],score:5,reasoning:"Generated a basic analysis with default values."})}catch(e){console.error(`${o()} Failed to save fallback problem analysis:`,e)}}try{console.log(`${o()} Starting Market Agent analysis`);let e=await h(n);i.market=e,n={...n,market_analysis:e},console.log(`${o()} Market analysis completed, score:`,e.score),l.push("market"),s&&await s("market",e)}catch(t){let e=`Market Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("market");try{s&&await s("market",{tam:1e9,sam:3e8,som:3e7,growth_rate:"Unknown, estimated 10-15%",market_demand:"Unable to determine precisely",why_now:"Current market conditions may be suitable",score:5,reasoning:"Generated a basic analysis with default values."})}catch(e){console.error(`${o()} Failed to save fallback market analysis:`,e)}}let u=Date.now()-r;if(u>6e4){console.log(`${o()} Time limit exceeded (${Math.round(u/1e3)}s elapsed). Skipping to report generation.`);let e={overall_score:60,business_type:"Startup",weighted_scores:{},category_scores:{},recommendation:"Based on limited analysis, your idea appears to have merit but requires further validation.",strengths:["Business idea provided for analysis"],weaknesses:["Complete analysis could not be performed due to time constraints"],suggested_actions:["Try again with a more detailed business description","Consider the standard validation process"],idea_improvements:{original_idea:a,improved_idea:n.enhanced_problem_statement||a,problem_statement:"See original idea",market_positioning:"",uvp:"",business_model:""},partial_completion:!0,completed_agents:l,failed_agents:c,generation_method:"partial_timeout",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return{success:!0,vc_report:e,agent_analyses:i,partial_completion:!0,warning:"Processing time limit exceeded. Returning partial results."}}try{console.log(`${o()} Starting Competitive Agent analysis`);let e=await f(n);i.competitive=e,n={...n,competitive_analysis:e,strengthened_differentiation:e.differentiation},console.log(`${o()} Competitive analysis completed, score:`,e.score),l.push("competitive"),s&&await s("competitive",e)}catch(t){let e=`Competitive Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("competitive")}try{console.log(`${o()} Starting UVP Agent analysis`);let e=await y(n);i.uvp=e,n={...n,uvp_analysis:e,refined_uvp:e.one_liner},console.log(`${o()} UVP analysis completed, score:`,e.score),l.push("uvp"),s&&await s("uvp",e)}catch(t){let e=`UVP Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("uvp")}try{console.log(`${o()} Starting Business Model Agent analysis`);let e=await v(n);i.business_model=e,n={...n,business_model_analysis:e,revenue_model:e.revenue_model},console.log(`${o()} Business model analysis completed, score:`,e.score),l.push("business_model"),s&&await s("business_model",e)}catch(t){let e=`Business Model Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("business_model")}try{console.log(`${o()} Starting Validation Agent analysis`);let e=await b(n);i.validation=e,n={...n,validation_analysis:e,validation_suggestions:e.validation_suggestions},console.log(`${o()} Validation analysis completed, score:`,e.score),l.push("validation"),s&&await s("validation",e)}catch(t){let e=`Validation Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("validation")}try{console.log(`${o()} Starting Legal Agent analysis`);let e=await w(n);i.legal=e,n={...n,legal_analysis:e,risk_tags:e.risk_tags},console.log(`${o()} Legal analysis completed, score:`,e.score),l.push("legal"),s&&await s("legal",e)}catch(t){let e=`Legal Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("legal")}try{console.log(`${o()} Starting Metrics Agent analysis`);let e=await k(n);i.metrics=e,n={...n,metrics_analysis:e},console.log(`${o()} Metrics analysis completed, score:`,e.score),l.push("metrics"),s&&await s("metrics",e)}catch(t){let e=`Metrics Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${o()} ${e}`),c.push("metrics")}let d=l.length/8;if(console.log(`${o()} Agent completion rate: ${(100*d).toFixed(1)}% (${l.length}/8 agents completed)`),0===l.length)return{success:!1,agent_analyses:i,error:"All validation agents failed to complete analysis",failed_at:"all_agents",error_details:{failed_agents:c,business_idea_length:a.length}};try{console.log(`${o()} Starting VC Lead synthesis`),c.length>0&&console.log(`${o()} Proceeding with VC Lead synthesis with ${l.length}/8 completed agents.`);let e=await A(n,i);return c.length>0&&(e.partial_completion=!0,e.completed_agents=l,e.failed_agents=c),i.vc_lead={report:e,reasoning:c.length>0?`Synthesis of ${l.length}/8 completed agent analyses`:"Final synthesis of all agent analyses"},console.log(`${o()} VC Lead synthesis completed, overall score:`,e.overall_score),{success:!0,vc_report:e,agent_analyses:i,partial_completion:c.length>0,warning:c.length>0?"Used fallback report generation due to synthesis failure":void 0}}catch(t){let e=`VC Lead synthesis failed: ${t instanceof Error?t.message:"Unknown error"}`;if(console.error(`${o()} ${e}`),l.length>0)try{console.log(`${o()} Generating fallback report from completed agent analyses`);let e=0,t=0;Object.entries(i).forEach(([s,r])=>{r&&"number"==typeof r.score&&(e+=r.score,t++)});let s=t>0?Math.round(e/t):60,r=[],n=[],u=[];i.problem&&i.problem.strengths&&r.push(...(i.problem.strengths||[]).slice(0,2)),i.market&&i.market.strengths&&r.push(...(i.market.strengths||[]).slice(0,2)),i.problem&&i.problem.weaknesses&&n.push(...(i.problem.weaknesses||[]).slice(0,2)),i.market&&i.market.weaknesses&&n.push(...(i.market.weaknesses||[]).slice(0,2));let d={overall_score:s,business_type:"Startup",weighted_scores:{},category_scores:{},idea_improvements:{original_idea:a,improved_idea:i.problem?.improved_problem_statement||a,problem_statement:"See original idea",market_positioning:"",uvp:i.uvp?.one_liner||"",business_model:i.business_model?.revenue_model||""},strengths:r.length>0?r:["Business idea provided for analysis"],weaknesses:n.length>0?n:["Complete analysis could not be performed"],suggested_actions:u.length>0?u:["Try again with a more detailed business description"],recommendation:`Based on the ${l.length} completed analyses, this idea has potential but requires refinement.`,partial_completion:!0,completed_agents:l,failed_agents:[...c,"vc_lead"],generation_method:"fallback",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return{success:!0,vc_report:d,agent_analyses:i,partial_completion:!0,warning:"Used fallback report generation due to synthesis failure"}}catch(e){console.error(`${o()} Fallback report generation failed:`,e)}return{success:!1,agent_analyses:i,error:"Failed to synthesize VC report",failed_at:"vc_lead_synthesis",error_details:{agent:"vc_lead",message:e,completed_agents:l,failed_agents:c}}}}catch(t){return console.error(`${o()} Error in VC validation process:`,t),{success:!1,error:t instanceof Error?t.message:"Unknown error in VC validation process",failed_at:"general_process",error_details:{stack:t instanceof Error?t.stack:void 0,business_idea_length:e.length}}}}async function _(e){try{var t;console.log("Problem agent analyzing business idea (length: "+e.user_input.length+"):",JSON.stringify(e.user_input.substring(0,50)+"..."));let s=process.env.OPENAI_API_KEY;console.log(`OpenAI API key status: ${s?"Present (length: "+s.length+", first 4 chars: "+s.substring(0,4)+")":"MISSING"}`);let r=(t={business_idea:e.user_input,additional_notes:e.additionalNotes||""},`
# Problem Specialist Agent - "The Diagnostician"

## Your Task
As the Problem Specialist Agent, your task is to extract, clarify, and strengthen the actual societal or functional problem from the business idea. You need to:

1. Extract the core problem being addressed
2. Clarify and rephrase it to be more precise
3. Identify root causes, scale, and urgency
4. Assess if this is a real, significant pain point

## Business Idea
${t.user_input}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "improved_problem_statement": "A clear, concise statement of the problem",
  "severity_index": 8, // A number from 1-10 indicating problem severity
  "problem_framing": "global", // Either "global" or "niche"
  "root_causes": [
    "Root cause 1",
    "Root cause 2"
  ],
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Focus on strengthening the problem definition. If the original idea is vague about the problem, create a clearer and more compelling problem statement. Be critical but constructive.
`);console.log("Sending request to OpenAI...");let o=new Promise((e,t)=>{setTimeout(()=>t(Error("OpenAI API call timed out after 15000ms")),15e3)});try{let e="gpt-3.5-turbo";console.log(`Using OpenAI model: ${e}`);let t=p.chat.completions.create({model:e,messages:[{role:"system",content:r},{role:"user",content:"Please analyze the business idea and provide your assessment in the required JSON format."}],temperature:.2,response_format:{type:"json_object"}}),s=await Promise.race([t,o]);console.log("OpenAI response received, processing response...");let a=s.choices[0]?.message.content||"";if(!a)throw Error("Empty response from OpenAI");console.log("Response content length:",a.length),console.log("Response content preview:",a.substring(0,100)+"...");try{let e=JSON.parse(a);if(console.log("Problem agent response successfully parsed, validating..."),!e.improved_problem_statement)throw console.error("Missing improved_problem_statement in analysis:",JSON.stringify(e)),Error("Invalid analysis structure: missing improved_problem_statement");let t="number"==typeof e.score?e.score:"string"==typeof e.score?parseFloat(e.score):0;(isNaN(t)||t<0||t>10)&&(console.warn(`Invalid score value (${e.score}), defaulting to 5`),t=5);let s=e.reasoning&&"string"==typeof e.reasoning?e.reasoning:"Analysis completed successfully.",r={improved_problem_statement:e.improved_problem_statement,severity_index:e.severity_index||5,problem_framing:"niche"===e.problem_framing?"niche":"global",root_causes:Array.isArray(e.root_causes)?e.root_causes:[],score:t,reasoning:s};return console.log("Problem agent analysis completed successfully"),r}catch(e){throw console.error("Failed to parse OpenAI response:",e),console.error("Raw response (first 500 chars):",a.substring(0,500)),Error(`JSON parsing error: ${e instanceof Error?e.message:"Unknown error"}`)}}catch(r){r instanceof Error&&(r.message.includes("timed out")||r.message.includes("timeout"))?console.error("OpenAI API call timed out. Generating fallback analysis."):console.error("OpenAI API error details:",{message:r instanceof Error?r.message:String(r),name:r instanceof Error?r.name:"Unknown",stack:r instanceof Error?r.stack:"No stack available"}),console.log("Generating fallback analysis due to OpenAI API error");let t=e.user_input.split(" "),s=t.slice(0,15).join(" ")+(t.length>15?"...":"");return{improved_problem_statement:`Problem: ${s}`,severity_index:5,problem_framing:"global",root_causes:["Analysis unavailable due to service limitations"],score:5,reasoning:"Analysis could not be completed due to service limitations. We've provided a simplified assessment of your business idea."}}}catch(t){return console.error("Fatal error in Problem Agent:",t),{improved_problem_statement:e.user_input,severity_index:5,problem_framing:"global",root_causes:[`Unable to analyze due to error: ${t instanceof Error?t.message:"Unknown error"}`],score:5,reasoning:`Analysis failed due to technical issues: ${t instanceof Error?t.message:"Unknown error"}`}}}async function h(e){try{let t=`
# Market Specialist Agent - "The Opportunity Validator"

## Your Task
As the Market Specialist Agent, your task is to validate the market opportunity for this business idea. You need to:

1. Estimate TAM/SAM/SOM
2. Assess real-world market demand
3. Determine growth rate and trends
4. Explain "why now" is the right time for this idea

## Business Idea
${e.user_input}

## Enhanced Problem Statement
${e.problem_analysis?e.problem_analysis.improved_problem_statement:"Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "tam": 5000000000, // Total Addressable Market in USD
  "sam": 1500000000, // Serviceable Addressable Market in USD
  "som": 300000000, // Serviceable Obtainable Market in USD
  "growth_rate": "15-20% annually",
  "market_demand": "Description of real-world demand and need",
  "why_now": "Explanation of why this is the right time for this solution",
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be realistic with your market size estimates, but don't be afraid to recognize a truly large opportunity when it exists.
`;e.user_input,console.log(`Market agent analyzing business context (enhanced problem: ${e.enhanced_problem_statement?.substring(0,50)||"None"}...)`);let s=process.env.OPENAI_API_KEY;console.log(`OpenAI API key status: ${s?"Present":"MISSING"}`);let r=new Promise((e,t)=>{setTimeout(()=>t(Error("Market agent API call timed out after 15000ms")),15e3)}),o=0,a=null;for(;o<=1;)try{o>0&&console.log(`Retrying Market Agent analysis (attempt ${o}/1)`);let e="gpt-3.5-turbo";console.log(`Using OpenAI model for market agent: ${e}`);let s=p.chat.completions.create({model:e,messages:[{role:"system",content:"You are the Market Specialist Agent (The Opportunity Validator). Your role is to analyze market size, growth potential, and validate the market opportunity."},{role:"user",content:t}],temperature:.5,response_format:{type:"json_object"}});console.log("Sending request to OpenAI for market analysis...");let a=await Promise.race([s,r]);console.log("Market agent response received");let n=a.choices[0].message.content;if(!n)throw Error("No response from Market Agent");try{console.log("Parsing market agent response...");let e=JSON.parse(n);return("number"!=typeof e.tam||isNaN(e.tam))&&(e.tam=1e9),("number"!=typeof e.sam||isNaN(e.sam))&&(e.sam=.3*e.tam),("number"!=typeof e.som||isNaN(e.som))&&(e.som=.1*e.sam),e.growth_rate||(e.growth_rate="10-15% annually"),e.market_demand||(e.market_demand="Moderate demand with growing interest"),e.why_now||(e.why_now="Current market conditions are favorable for this solution"),e.score&&"number"==typeof e.score||(e.score=65),e.reasoning||(e.reasoning="Analysis completed with default values"),console.log("Market agent analysis completed successfully"),e}catch(t){let e=t instanceof Error?t.message:"Unknown parsing error";throw console.error("Market Agent returned invalid JSON:",e),console.error("Response content:",n.substring(0,500)),Error(`Market Agent returned invalid JSON: ${e}`)}}catch(e){if(e instanceof Error&&(e.message.includes("timed out")||e.message.includes("timeout"))?console.error("Market agent API call timed out"):console.error("Market agent API error:",e),a=e instanceof Error?e:Error(String(e)),console.error(`Market Agent analysis failed (attempt ${o+1}/2):`,a.message),++o<=1){let e=Math.min(1e3*Math.pow(2,o-1),8e3);console.log(`Waiting ${e}ms before retry...`),await new Promise(t=>setTimeout(t,e))}}return console.log("All Market Agent retries failed, generating fallback analysis"),{tam:1e9,sam:3e8,som:3e7,growth_rate:"Unknown, estimated 10-15%",market_demand:"Unable to determine precisely",why_now:"Current market conditions may be suitable",score:60,reasoning:"Auto-generated due to API processing issues. This is a simplified analysis with estimated market sizes."}}catch(e){return console.error("Fatal error in Market Agent:",e),{tam:1e9,sam:3e8,som:3e7,growth_rate:"Unknown, estimated 10-15%",market_demand:"Unable to determine precisely",why_now:"Current market conditions may be suitable",score:60,reasoning:"Auto-generated due to technical difficulties. This is a simplified analysis with estimated market sizes."}}}async function f(e){let t=`
# Competitive Specialist Agent - "The Moat Evaluator"

## Your Task
As the Competitive Specialist Agent, your task is to evaluate the competitive landscape and moat potential for this business idea. You need to:

1. Identify existing competitors or solutions
2. Highlight gaps in existing solutions
3. Strengthen the idea's differentiation angle
4. Assess the defensibility of the business

## Business Idea
${e.user_input}

## Enhanced Problem Statement
${e.problem_analysis?e.problem_analysis.improved_problem_statement:"Not available"}

## Market Analysis
${e.market_analysis?`
- TAM: $${Math.round(e.market_analysis.tam/1e6)}M
- Growth Rate: ${e.market_analysis.growth_rate}
`:"Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "competitors": [
    {
      "name": "Competitor 1",
      "description": "Brief description",
      "strengths": ["Strength 1", "Strength 2"],
      "weaknesses": ["Weakness 1", "Weakness 2"]
    }
  ],
  "differentiation": "Clear statement of how this idea differentiates from competitors",
  "moat_classification": "defensible", // Must be one of: "none", "weak", "defensible"
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

If you can't identify specific competitors, suggest similar or adjacent solutions. Be realistic about the defensibility of the business.
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Competitive Specialist Agent (The Moat Evaluator). Your role is to identify competitors and evaluate the competitive advantage or moat of the business idea."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Competitive Agent");return JSON.parse(s)}async function y(e){let t=`
# UVP Specialist Agent - "The Message Refiner"

## Your Task
As the UVP Specialist Agent, your task is to craft and refine a clear, compelling unique value proposition. You need to:

1. Create a strong one-line UVP
2. Highlight emotional and strategic appeal
3. Show the before/after user outcome
4. Rate the stickiness and clarity of the value proposition

## Business Idea
${e.user_input}

## Enhanced Problem Statement
${e.problem_analysis?e.problem_analysis.improved_problem_statement:"Not available"}

## Competitive Analysis
${e.competitive_analysis?`
Differentiation: ${e.competitive_analysis.differentiation}
Moat Classification: ${e.competitive_analysis.moat_classification}
`:"Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "one_liner": "Clear, compelling one-line UVP",
  "emotional_appeal": "Description of emotional resonance with users",
  "strategic_appeal": "Description of strategic value to users or businesses",
  "before_after": {
    "before": "User situation before using the product",
    "after": "User situation after using the product"
  },
  "stickiness_score": 8, // How memorable the value prop is (1-10)
  "differentiation_clarity": 7, // How clearly differentiated (1-10)
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Focus on making the UVP clear, memorable, and differentiating. If the original idea is vague, take liberty to strengthen the value proposition significantly.
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the UVP Specialist Agent (The Message Refiner). Your role is to craft a clear, compelling unique value proposition for the business idea."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from UVP Agent");return JSON.parse(s)}async function v(e){let t=`
# Business Model Specialist Agent - "The Monetization Analyst"

## Your Task
As the Business Model Specialist Agent, your task is to analyze and improve the revenue model. You need to:

1. Determine if the model can generate sustainable revenue
2. Suggest or refine pricing strategy
3. Create pricing tiers if applicable
4. Assess monetization viability

## Business Idea
${e.user_input}

## Enhanced Problem Statement
${e.problem_analysis?e.problem_analysis.improved_problem_statement:"Not available"}

## Unique Value Proposition
${e.uvp_analysis?e.uvp_analysis.one_liner:"Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "revenue_model": "Description of how the business will make money",
  "pricing_tiers": [
    {
      "name": "Free",
      "price": "$0",
      "features": ["Feature 1", "Feature 2"]
    },
    {
      "name": "Pro",
      "price": "$29/mo",
      "features": ["All Free features", "Premium Feature 1"]
    }
  ],
  "sustainability_factors": [
    "Factor that contributes to long-term revenue"
  ],
  "monetization_viability": 8, // 1-10 score on revenue potential
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be practical and realistic about monetization. If the original idea lacks a clear revenue model, suggest appropriate models for the type of business.
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Business Model Specialist Agent (The Monetization Analyst). Your role is to analyze and improve the revenue model and business sustainability."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Business Model Agent");return JSON.parse(s)}async function b(e){let t=`
# Validation Specialist Agent - "The Signal Seeker"

## Your Task
As the Validation Specialist Agent, your task is to assess current validation and suggest future validation strategies. You need to:

1. Evaluate any existing validation efforts
2. Recommend how to validate further
3. Assess signal quality
4. Suggest potential customer quotes or validation metrics

## Business Idea
${e.user_input}

## Enhanced Problem Statement
${e.problem_analysis?e.problem_analysis.improved_problem_statement:"Not available"}

## Business Model
${e.business_model_analysis?`
Revenue Model: ${e.business_model_analysis.revenue_model}
`:"Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "current_validation": {
    "waitlist": false,
    "surveys": false,
    "interviews": false
  },
  "validation_suggestions": [
    "Suggestion for how to validate the idea"
  ],
  "signal_quality": "weak", // Must be one of: "none", "weak", "moderate", "strong"
  "user_quotes": [
    "Hypothetical quote that would indicate strong validation"
  ],
  "score": 5, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be honest about the current validation status, and realistic about what would constitute good validation for this specific idea.
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Validation Specialist Agent (The Signal Seeker). Your role is to assess current validation efforts and recommend further validation strategies."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Validation Agent");return JSON.parse(s)}async function w(e){let t=`
# Legal Specialist Agent - "The Compliance Evaluator"

## Your Task
As the Legal Specialist Agent, your task is to identify legal and regulatory concerns. You need to:

1. Identify legal or regulatory friction points
2. Flag ethical concerns
3. Highlight operational liabilities
4. Suggest required disclaimers or compliance measures

## Business Idea
${e.user_input}

## Enhanced Problem Statement
${e.problem_analysis?e.problem_analysis.improved_problem_statement:"Not available"}

## Business Model
${e.business_model_analysis?`
Revenue Model: ${e.business_model_analysis.revenue_model}
`:"Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "friction_points": [
    "Legal or regulatory issue the business might face"
  ],
  "ethical_concerns": [
    "Potential ethical issue to consider"
  ],
  "operational_liabilities": [
    "Operational risk from a legal perspective"
  ],
  "required_disclaimers": [
    "Legal disclaimer or notice that would be required"
  ],
  "risk_tags": [
    "GDPR", "Privacy", "Intellectual Property"
  ],
  "risk_score": 6, // 1-10 score on legal risk (10 is highest risk)
  "compliance_readiness": "needs_work", // Must be one of: "not_ready", "needs_work", "ready"
  "score": 6, // Your overall score from 1-10 (10 is GOOD from a legal perspective)
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be thorough in identifying potential legal issues, but don't invent problems that aren't relevant to this specific business.
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Legal Specialist Agent (The Compliance Evaluator). Your role is to identify legal, ethical, and regulatory risks in the business idea."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Legal Agent");return JSON.parse(s)}async function k(e){let t=`
# Metrics Specialist Agent - "The Quantifier"

## Your Task
As the Metrics Specialist Agent, your task is to provide key strategic metrics. You need to:

1. Estimate important business metrics
2. Calculate ROI and success probability
3. Forecast scalability and growth metrics
4. Provide MVP cost estimate

## Business Idea
${e.user_input}

## Enhanced Problem Statement
${e.problem_analysis?e.problem_analysis.improved_problem_statement:"Not available"}

## Market Analysis
${e.market_analysis?`
- TAM: $${Math.round(e.market_analysis.tam/1e6)}M
- SAM: $${Math.round(e.market_analysis.sam/1e6)}M
- SOM: $${Math.round(e.market_analysis.som/1e6)}M
`:"Not available"}

## Business Model
${e.business_model_analysis?`
Revenue Model: ${e.business_model_analysis.revenue_model}
`:"Not available"}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "roi": "3.2x in Year 1",
  "scalability_index": 85, // 1-100 score on scalability
  "mvp_budget_estimate": "$75,000 - $120,000",
  "ltv": "$4,500", // Lifetime Value
  "cac": "$1,200", // Customer Acquisition Cost
  "success_rate": "65-75%", // Overall success probability
  "breakeven_point": "14-18 months",
  "score": 7, // Your overall score from 1-10
  "reasoning": "Explanation of your thought process and score"
}
\`\`\`

Be realistic with your estimates, providing ranges when appropriate. Base your calculations on the market, business model, and competitive information available.
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Strategic Metrics Specialist Agent (The Quantifier). Your role is to provide key strategic metrics and forecasts for the business idea."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Metrics Agent");return JSON.parse(s)}async function A(e,t){let s=function(e,t){let{businessType:s,weights:r}=function(e,t){let s={problem:.15,market:.15,competitive:.15,uvp:.15,business_model:.15,validation:.1,legal:.05,metrics:.1,vc_lead:0},r="General",o={...s},a=(e.user_input||"").toLowerCase(),n=t.problem||{},i=t.business_model||{},l=t.legal||{};return"global"===n.problem_framing||a.includes("social impact")||a.includes("donation")||a.includes("non-profit")||a.includes("charity")?(r="Social Impact",o={...s,problem:.25,legal:.15,business_model:.2,market:.1,competitive:.1,uvp:.1,validation:.05,metrics:.05,vc_lead:0}):a.includes("saas")||a.includes("software")||a.includes("b2b")||a.includes("enterprise")||(i.revenue_model||"").toLowerCase().includes("subscription")?(r="B2B SaaS",o={...s,uvp:.2,market:.2,business_model:.2,problem:.15,competitive:.1,validation:.05,legal:.05,metrics:.05,vc_lead:0}):a.includes("consumer")||a.includes("app")||a.includes("mobile")?(r="Consumer App",o={...s,uvp:.25,validation:.2,problem:.15,market:.15,competitive:.1,business_model:.1,legal:.025,metrics:.025,vc_lead:0}):a.includes("health")||a.includes("medical")||a.includes("patient")||(l.risk_tags||[]).some(e=>e.toLowerCase().includes("health")||e.toLowerCase().includes("medical")||e.toLowerCase().includes("hipaa"))?(r="Healthcare",o={...s,legal:.25,market:.2,validation:.15,problem:.15,business_model:.1,uvp:.05,competitive:.05,metrics:.05,vc_lead:0}):(a.includes("marketplace")||a.includes("platform")||a.includes("connect")||(i.revenue_model||"").toLowerCase().includes("transaction fee")||(i.revenue_model||"").toLowerCase().includes("commission"))&&(r="Marketplace",o={...s,competitive:.2,business_model:.2,market:.15,uvp:.15,problem:.1,validation:.1,legal:.05,metrics:.05,vc_lead:0}),{businessType:r,weights:o}}(e,t);return`
# VC Lead Agent - Final Synthesis

## Your Task
As the VC Lead Agent, your task is to synthesize all specialist analyses into a comprehensive VC-style report. You need to:

1. Determine dynamic weighting based on the nature of the idea (already done for you)
2. Generate an overall score
3. Provide a VC-style recommendation
4. Identify strengths and weaknesses
5. Suggest next steps for the founder

## Business Idea
${e.user_input}

## Specialist Agent Analyses

### Problem Analysis
Score: ${t.problem?.score||"N/A"}/10
${t.problem?.improved_problem_statement||"Not available"}

### Market Analysis
Score: ${t.market?.score||"N/A"}/10
TAM: $${(t.market?.tam||0)/1e6}M
SAM: $${(t.market?.sam||0)/1e6}M
SOM: $${(t.market?.som||0)/1e6}M

### Competitive Analysis
Score: ${t.competitive?.score||"N/A"}/10
Moat: ${t.competitive?.moat_classification||"Not available"}

### UVP Analysis
Score: ${t.uvp?.score||"N/A"}/10
UVP: ${t.uvp?.one_liner||"Not available"}

### Business Model Analysis
Score: ${t.business_model?.score||"N/A"}/10
Revenue Model: ${t.business_model?.revenue_model||"Not available"}

### Validation Analysis
Score: ${t.validation?.score||"N/A"}/10
Signal Quality: ${t.validation?.signal_quality||"Not available"}

### Legal Analysis
Score: ${t.legal?.score||"N/A"}/10
Risk Level: ${t.legal?.risk_score||"N/A"}/10 (higher is more risky)

### Metrics Analysis
Score: ${t.metrics?.score||"N/A"}/10
ROI: ${t.metrics?.roi||"Not available"}
MVP Cost: ${t.metrics?.mvp_budget_estimate||"Not available"}

## Dynamic Weighting
Based on the business idea type (${s}), the following weights are applied:
${Object.entries(r).filter(([e])=>"vc_lead"!==e).map(([e,t])=>`- ${e}: ${100*t}%`).join("\n")}

## Required Output Format
You must return your analysis in the following JSON format:

\`\`\`json
{
  "overall_score": 72, // 0-100 score based on weighted average
  "business_type": "${s}",
  "weighted_scores": {
    "problem": 7.5,
    "market": 6.0,
    "competitive": 5.0,
    "uvp": 8.0,
    "business_model": 7.0,
    "validation": 4.0,
    "legal": 7.0,
    "metrics": 6.0
  },
  "category_scores": {
    "problem": 7,
    "market": 6,
    "competitive": 5,
    "uvp": 8,
    "business_model": 7,
    "validation": 4,
    "legal": 7,
    "metrics": 6
  },
  "idea_improvements": {
    "original_idea": "Brief summary of original idea",
    "improved_idea": "Stronger, more refined version of the idea",
    "problem_statement": "Improved problem statement",
    "market_positioning": "Improved market position",
    "uvp": "Improved value proposition",
    "business_model": "Improved business model"
  },
  "recommendation": "VC-style recommendation (fund, pass, or needs work)",
  "strengths": [
    "Key strength of the idea"
  ],
  "weaknesses": [
    "Key weakness of the idea"
  ],
  "suggested_actions": [
    "Action the founder should take next"
  ],
  "created_at": "${new Date().toISOString()}",
  "updated_at": "${new Date().toISOString()}"
}
\`\`\`

Make your assessment realistic and constructive. Apply the proper weighting to calculate the overall score.
`}(e,t),r=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the VC Lead Agent, responsible for synthesizing all specialist analyses into a comprehensive VC-style report with dynamic weighting based on the nature of the idea."},{role:"user",content:s}],temperature:.5,response_format:{type:"json_object"}})).choices[0].message.content;if(!r)throw Error("No response from VC Lead Agent");return JSON.parse(r)}let $=["problem","market","competitive","uvp","business_model","validation","legal","metrics"];async function S(e){try{let t=new URL(e.url),s=t.searchParams.get("id"),r="true"===t.searchParams.get("triggerNext");if(!s)return i.NextResponse.json({success:!1,error:"Missing validation ID"},{status:400});let o=await m(s);if(!o.success||!o.data)return i.NextResponse.json({success:!1,error:o.error||"Validation not found"},{status:404});let a=o.data;if("completed"===a.validation.status||"completed_with_errors"===a.validation.status)return i.NextResponse.json({success:!0,data:a,status:"completed",nextAgent:null});let n=a.agent_analyses.map(e=>e.agent_type),l=$.find(e=>!n.includes(e));if(!l&&$.every(e=>n.includes(e))&&"completed"!==a.validation.status){if(r){let e={overall_score:65,business_type:"Startup",weighted_scores:{},category_scores:{},recommendation:"Based on our analysis, your business idea shows potential.",strengths:["Your idea has been analyzed by our AI agents"],weaknesses:[],suggested_actions:["Review the detailed agent analyses for specific feedback"],idea_improvements:{original_idea:a.form.business_idea||"",improved_idea:"",problem_statement:"",market_positioning:"",uvp:"",business_model:""},partial_completion:!1,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};await d(s,e,65),await c(s,"completed");let t=await m(s);return i.NextResponse.json({success:!0,data:t.data,status:"completed",nextAgent:null,action:"generated_final_report"})}return i.NextResponse.json({success:!0,data:a,status:"needs_final_report",nextAgent:null})}if(r&&l)try{if(a.validation.agent_responses&&a.validation.agent_responses[l]&&"object"==typeof a.validation.agent_responses[l]&&"processing"===a.validation.agent_responses[l].status)return console.log(`Agent ${l} is already processing. Skipping duplicate start.`),i.NextResponse.json({success:!0,data:a,status:"processing",nextAgent:l,action:"skipped_already_processing"});let e={status:"processing",agent_type:l,message:`${l} analysis in progress`};return await u(s,l,{businessIdea:a.form.business_idea||""},e,5,"Processing started",{}),M(s,l,a),i.NextResponse.json({success:!0,data:a,status:"processing",nextAgent:l,action:"started_agent_processing"})}catch(e){return console.error("Error starting agent processing:",e),i.NextResponse.json({success:!0,data:a,status:"error",nextAgent:l,error:e instanceof Error?e.message:"Unknown error",action:"failed_to_start_processing"})}return i.NextResponse.json({success:!0,data:a,status:a.validation.status,nextAgent:l,agentCount:a.agent_analyses.length,completedAgents:n})}catch(e){return console.error("Error in VC analysis progress API:",e),i.NextResponse.json({success:!1,error:e instanceof Error?e.message:"Unknown error"},{status:500})}}async function M(e,t,s){try{let r=async(r,o)=>{if(r===t)try{if(!o)return;let a="number"==typeof o.score?Math.round(o.score):"string"==typeof o.score?Math.round(parseFloat(o.score)):5,n=o.reasoning||"Analysis completed with limited information.",i=s.validation.agent_responses&&s.validation.agent_responses[r];if(i&&"object"==typeof i&&"processing"!==i.status&&void 0!==i.score){console.log(`Agent ${r} already has a completed analysis. Skipping duplicate save.`);return}let l=await u(e,t,{businessIdea:s.form.business_idea},o,a,n,{});l.success?console.log(`Saved ${t} agent analysis to database`):console.error(`Error saving ${t} agent analysis:`,l.error)}catch(e){console.error("Error in agent completion callback:",e)}},o={user_input:s.form.business_idea};for(let e of s.agent_analyses)o[`${e.agent_type}_analysis`]=e.analysis;return g(s.form.business_idea,{targetAgent:t,...o},r),!0}catch(e){return console.error(`Error starting ${t} agent processing:`,e),!1}}let I=new o.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/vc-analysis-progress/route",pathname:"/api/vc-analysis-progress",filename:"route",bundlePath:"app/api/vc-analysis-progress/route"},resolvedPagePath:"/Users/artfct/Documents/Software Business/startup-validator/src/app/api/vc-analysis-progress/route.ts",nextConfigOutput:"",userland:r}),{workAsyncStorage:E,workUnitAsyncStorage:N,serverHooks:x}=I;function O(){return(0,n.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:N})}},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[447,570,345,580,905],()=>s(80416));module.exports=r})();