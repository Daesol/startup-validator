(()=>{var e={};e.id=163,e.ids=[163],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},6475:(e,t,s)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var s in t)Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}(t,{callServer:function(){return r.callServer},createServerReference:function(){return o},findSourceMapURL:function(){return a.findSourceMapURL}});let r=s(11264),a=s(11448),o=s(19357).createServerReference},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},12929:(e,t,s)=>{Promise.resolve().then(s.bind(s,61410))},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},23703:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});var r=s(37413),a=s(34647);function o(){return(0,r.jsx)(a.default,{})}},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},34647:(e,t,s)=>{"use strict";s.d(t,{default:()=>r});let r=(0,s(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/artfct/Documents/Software Business/startup-validator/src/features/validation/pages/vc-validation-page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/artfct/Documents/Software Business/startup-validator/src/features/validation/pages/vc-validation-page.tsx","default")},34729:(e,t,s)=>{"use strict";s.d(t,{T:()=>i});var r=s(60687),a=s(43210),o=s(4780);let i=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("textarea",{className:(0,o.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:s,...t}));i.displayName="Textarea"},37830:e=>{"use strict";e.exports=require("node:stream/web")},38578:(e,t,s)=>{"use strict";s.r(t),s.d(t,{"40d64fb9bfd76b02653ab9ccb41969471bb1655fef":()=>S});var r=s(91199);s(42087);var a=s(7944),o=s(90141),i=s(37350);let n=(0,s(91842).UU)("https://dynksioggkqwgivykuvh.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDUzMDEsImV4cCI6MjA1OTg4MTMwMX0.vMMZu55NMuzra_iq3JLraanzUlWrzwXRyMQ40TeJtJ0");async function l(e,t){try{console.log(`Creating VC validation for form ID: ${e}`);let{data:s,error:r}=await n.from("vc_validation_analyses").select("id").eq("validation_form_id",e).maybeSingle();if(r&&"PGRST116"!==r.code)throw console.error("Error checking for existing validation:",r),Error(`Database error: ${r.message}`);if(s)return console.log(`Existing VC validation found with ID: ${s.id}`),{success:!0,validationId:s.id};let{data:a,error:o}=await n.from("vc_validation_analyses").insert({validation_form_id:e,status:"pending",agent_responses:{},vc_report:{overall_score:0,business_type:"Unspecified",weighted_scores:{},category_scores:{},recommendation:"",strengths:[],weaknesses:[],suggested_actions:[],idea_improvements:{original_idea:t,improved_idea:"",problem_statement:"",market_positioning:"",uvp:"",business_model:""},created_at:new Date().toISOString(),updated_at:new Date().toISOString()}}).select("id").single();if(o)return console.error("Error creating VC validation:",o),{success:!1,error:`Failed to create VC validation: ${o.message}`};return console.log(`New VC validation created with ID: ${a.id}`),{success:!0,validationId:a.id}}catch(e){return console.error("Error in createVCValidation:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}async function c(e,t){try{console.log(`Updating VC validation status to "${t}" for ID: ${e}`);let{error:s}=await n.from("vc_validation_analyses").update({status:t,updated_at:new Date().toISOString()}).eq("id",e);if(s)return console.error("Error updating VC validation status:",s),{success:!1,error:s.message};return{success:!0}}catch(e){return console.error("Error in updateVCValidationStatus:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}async function d(e,t,s,r,a,o,i){try{console.log(`Adding ${t} agent analysis for validation ID: ${e}`);let{data:l,error:c}=await n.from("vc_agent_analyses").insert({vc_validation_id:e,agent_type:t,input_context:s,analysis:r,score:a,reasoning:o,enhanced_context:i,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}).select("id").single();if(c)return console.error(`Error adding ${t} agent analysis:`,c),{success:!1,error:c.message};let{data:d,error:u}=await n.from("vc_validation_analyses").select("agent_responses").eq("id",e).single();u&&console.error("Error fetching current agent_responses:",u);let m=d?.agent_responses||{};m[t]=r;let{error:p}=await n.from("vc_validation_analyses").update({agent_responses:m,updated_at:new Date().toISOString()}).eq("id",e);return p&&console.error(`Error updating agent_responses with ${t} analysis:`,p),console.log(`Added ${t} agent analysis with ID: ${l.id}`),{success:!0,analysisId:l.id}}catch(e){return console.error("Error in addAgentAnalysis:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}async function u(e,t,s){try{let r;console.log(`Setting final VC report for validation ID: ${e}`),r="string"==typeof s?Math.round(parseFloat(s)):Math.round(s),console.log(`Parsed overall score: ${r} (original: ${s})`);let{error:a}=await n.from("vc_validation_analyses").update({vc_report:t,score:r,status:"completed",updated_at:new Date().toISOString()}).eq("id",e);if(a)return console.error("Error setting VC report:",a),{success:!1,error:a.message};return{success:!0}}catch(e){return console.error("Error in setVCReport:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}async function m(e){try{console.log(`Fetching VC validation with analyses for ID: ${e}`);let{data:t,error:s}=await n.from("vc_validation_analyses").select("*").eq("id",e).maybeSingle();if(!t){console.log(`No VC validation found with ID ${e}, trying to find by form ID`);let{data:s,error:r}=await n.from("vc_validation_analyses").select("*").eq("validation_form_id",e).maybeSingle();if(r&&"PGRST116"!==r.code)return console.error("Error fetching VC validation by form ID:",r),{success:!1,error:r.message};if(s)t=s,console.log(`Found VC validation with form ID ${e}`);else{console.log("No match found, trying to fetch the most recent validation");let{data:e,error:s}=await n.from("vc_validation_analyses").select("*").order("created_at",{ascending:!1}).limit(1).maybeSingle();if(s)console.error("Error fetching recent validation:",s);else{if(!e)return console.error("No VC validation found with this ID or form ID"),{success:!1,error:"No VC validation found"};console.log(`Found most recent validation with ID: ${e.id}, form ID: ${e.validation_form_id}`),t=e}}}if(!t)return{success:!1,error:"No VC validation found with any of the attempted methods"};let{data:r,error:a}=await n.from("validation_forms").select("*").eq("id",t.validation_form_id).single();if(a)return console.error("Error fetching validation form:",a),{success:!1,error:a.message};let{data:o,error:i}=await n.from("vc_agent_analyses").select("*").eq("vc_validation_id",t.id).order("created_at",{ascending:!0});if(i)return console.error("Error fetching agent analyses:",i),{success:!1,error:i.message};console.log(`Validation state - ID: ${t.id}, Form ID: ${t.validation_form_id}, Status: ${t.status}, Agents: ${o?.length||0}`);let l={form:r,validation:t,agent_analyses:o||[]};return{success:!0,data:l}}catch(e){return console.error("Error in getVCValidationWithAnalyses:",e),{success:!1,error:e instanceof Error?e.message:"Unknown error"}}}let p=new(s(52035)).Ay({apiKey:process.env.OPENAI_API_KEY});async function g(e,t={},s){let r=Date.now(),a=()=>{let e=Math.round((Date.now()-r)/1e3);return`[${e}s]`};try{console.log(`${a()} Starting VC validation for business idea:`,e.substring(0,100));let o=e.trim();if(o.length<10)return{success:!1,error:"Business idea is too short for meaningful analysis",failed_at:"input_validation",error_details:{business_idea_length:o.length}};let i={user_input:o,...t},n={problem:null,market:null,competitive:null,uvp:null,business_model:null,validation:null,legal:null,metrics:null,vc_lead:null,market_fit:null,competition:null,team:null,financials:null,traction:null,investor_readiness:null},l=[],c=[];try{console.log(`${a()} Starting Problem Agent analysis`);let e=await f(i);n.problem=e,i={...i,problem_analysis:e,enhanced_problem_statement:e.improved_problem_statement},console.log(`${a()} Problem analysis completed, score:`,e.score),l.push("problem"),s&&await s("problem",e)}catch(t){let e=`Problem Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("problem"),i.enhanced_problem_statement=o;try{s&&await s("problem",{improved_problem_statement:o,severity_index:5,problem_framing:"global",root_causes:["Analysis could not be completed"],score:5,reasoning:"Generated a basic analysis with default values."})}catch(e){console.error(`${a()} Failed to save fallback problem analysis:`,e)}}try{console.log(`${a()} Starting Market Agent analysis`);let e=await h(i);n.market=e,i={...i,market_analysis:e},console.log(`${a()} Market analysis completed, score:`,e.score),l.push("market"),s&&await s("market",e)}catch(t){let e=`Market Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("market");try{s&&await s("market",{tam:1e9,sam:3e8,som:3e7,growth_rate:"Unknown, estimated 10-15%",market_demand:"Unable to determine precisely",why_now:"Current market conditions may be suitable",score:5,reasoning:"Generated a basic analysis with default values."})}catch(e){console.error(`${a()} Failed to save fallback market analysis:`,e)}}let d=Date.now()-r;if(d>6e4){console.log(`${a()} Time limit exceeded (${Math.round(d/1e3)}s elapsed). Skipping to report generation.`);let e={overall_score:60,business_type:"Startup",weighted_scores:{},category_scores:{},recommendation:"Based on limited analysis, your idea appears to have merit but requires further validation.",strengths:["Business idea provided for analysis"],weaknesses:["Complete analysis could not be performed due to time constraints"],suggested_actions:["Try again with a more detailed business description","Consider the standard validation process"],idea_improvements:{original_idea:o,improved_idea:i.enhanced_problem_statement||o,problem_statement:"See original idea",market_positioning:"",uvp:"",business_model:""},partial_completion:!0,completed_agents:l,failed_agents:c,generation_method:"partial_timeout",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return{success:!0,vc_report:e,agent_analyses:n,partial_completion:!0,warning:"Processing time limit exceeded. Returning partial results."}}try{console.log(`${a()} Starting Competitive Agent analysis`);let e=await v(i);n.competitive=e,i={...i,competitive_analysis:e,strengthened_differentiation:e.differentiation},console.log(`${a()} Competitive analysis completed, score:`,e.score),l.push("competitive"),s&&await s("competitive",e)}catch(t){let e=`Competitive Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("competitive")}try{console.log(`${a()} Starting UVP Agent analysis`);let e=await b(i);n.uvp=e,i={...i,uvp_analysis:e,refined_uvp:e.one_liner},console.log(`${a()} UVP analysis completed, score:`,e.score),l.push("uvp"),s&&await s("uvp",e)}catch(t){let e=`UVP Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("uvp")}try{console.log(`${a()} Starting Business Model Agent analysis`);let e=await y(i);n.business_model=e,i={...i,business_model_analysis:e,revenue_model:e.revenue_model},console.log(`${a()} Business model analysis completed, score:`,e.score),l.push("business_model"),s&&await s("business_model",e)}catch(t){let e=`Business Model Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("business_model")}try{console.log(`${a()} Starting Validation Agent analysis`);let e=await _(i);n.validation=e,i={...i,validation_analysis:e,validation_suggestions:e.validation_suggestions},console.log(`${a()} Validation analysis completed, score:`,e.score),l.push("validation"),s&&await s("validation",e)}catch(t){let e=`Validation Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("validation")}try{console.log(`${a()} Starting Legal Agent analysis`);let e=await w(i);n.legal=e,i={...i,legal_analysis:e,risk_tags:e.risk_tags},console.log(`${a()} Legal analysis completed, score:`,e.score),l.push("legal"),s&&await s("legal",e)}catch(t){let e=`Legal Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("legal")}try{console.log(`${a()} Starting Metrics Agent analysis`);let e=await k(i);n.metrics=e,i={...i,metrics_analysis:e},console.log(`${a()} Metrics analysis completed, score:`,e.score),l.push("metrics"),s&&await s("metrics",e)}catch(t){let e=`Metrics Agent failed: ${t instanceof Error?t.message:"Unknown error"}`;console.error(`${a()} ${e}`),c.push("metrics")}let u=l.length/8;if(console.log(`${a()} Agent completion rate: ${(100*u).toFixed(1)}% (${l.length}/8 agents completed)`),0===l.length)return{success:!1,agent_analyses:n,error:"All validation agents failed to complete analysis",failed_at:"all_agents",error_details:{failed_agents:c,business_idea_length:o.length}};try{console.log(`${a()} Starting VC Lead synthesis`),c.length>0&&console.log(`${a()} Proceeding with VC Lead synthesis with ${l.length}/8 completed agents.`);let e=await x(i,n);return c.length>0&&(e.partial_completion=!0,e.completed_agents=l,e.failed_agents=c),n.vc_lead={report:e,reasoning:c.length>0?`Synthesis of ${l.length}/8 completed agent analyses`:"Final synthesis of all agent analyses"},console.log(`${a()} VC Lead synthesis completed, overall score:`,e.overall_score),{success:!0,vc_report:e,agent_analyses:n,partial_completion:c.length>0,warning:c.length>0?"Used fallback report generation due to synthesis failure":void 0}}catch(t){let e=`VC Lead synthesis failed: ${t instanceof Error?t.message:"Unknown error"}`;if(console.error(`${a()} ${e}`),l.length>0)try{console.log(`${a()} Generating fallback report from completed agent analyses`);let e=0,t=0;Object.entries(n).forEach(([s,r])=>{r&&"number"==typeof r.score&&(e+=r.score,t++)});let s=t>0?Math.round(e/t):60,r=[],i=[],d=[];n.problem&&n.problem.strengths&&r.push(...(n.problem.strengths||[]).slice(0,2)),n.market&&n.market.strengths&&r.push(...(n.market.strengths||[]).slice(0,2)),n.problem&&n.problem.weaknesses&&i.push(...(n.problem.weaknesses||[]).slice(0,2)),n.market&&n.market.weaknesses&&i.push(...(n.market.weaknesses||[]).slice(0,2));let u={overall_score:s,business_type:"Startup",weighted_scores:{},category_scores:{},idea_improvements:{original_idea:o,improved_idea:n.problem?.improved_problem_statement||o,problem_statement:"See original idea",market_positioning:"",uvp:n.uvp?.one_liner||"",business_model:n.business_model?.revenue_model||""},strengths:r.length>0?r:["Business idea provided for analysis"],weaknesses:i.length>0?i:["Complete analysis could not be performed"],suggested_actions:d.length>0?d:["Try again with a more detailed business description"],recommendation:`Based on the ${l.length} completed analyses, this idea has potential but requires refinement.`,partial_completion:!0,completed_agents:l,failed_agents:[...c,"vc_lead"],generation_method:"fallback",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return{success:!0,vc_report:u,agent_analyses:n,partial_completion:!0,warning:"Used fallback report generation due to synthesis failure"}}catch(e){console.error(`${a()} Fallback report generation failed:`,e)}return{success:!1,agent_analyses:n,error:"Failed to synthesize VC report",failed_at:"vc_lead_synthesis",error_details:{agent:"vc_lead",message:e,completed_agents:l,failed_agents:c}}}}catch(t){return console.error(`${a()} Error in VC validation process:`,t),{success:!1,error:t instanceof Error?t.message:"Unknown error in VC validation process",failed_at:"general_process",error_details:{stack:t instanceof Error?t.stack:void 0,business_idea_length:e.length}}}}async function f(e){try{var t;console.log("Problem agent analyzing business idea (length: "+e.user_input.length+"):",JSON.stringify(e.user_input.substring(0,50)+"..."));let s=process.env.OPENAI_API_KEY;console.log(`OpenAI API key status: ${s?"Present (length: "+s.length+", first 4 chars: "+s.substring(0,4)+")":"MISSING"}`);let r=(t={business_idea:e.user_input,additional_notes:e.additionalNotes||""},`
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
`);console.log("Sending request to OpenAI...");let a=new Promise((e,t)=>{setTimeout(()=>t(Error("OpenAI API call timed out after 15000ms")),15e3)});try{let e="gpt-3.5-turbo";console.log(`Using OpenAI model: ${e}`);let t=p.chat.completions.create({model:e,messages:[{role:"system",content:r},{role:"user",content:"Please analyze the business idea and provide your assessment in the required JSON format."}],temperature:.2,response_format:{type:"json_object"}}),s=await Promise.race([t,a]);console.log("OpenAI response received, processing response...");let o=s.choices[0]?.message.content||"";if(!o)throw Error("Empty response from OpenAI");console.log("Response content length:",o.length),console.log("Response content preview:",o.substring(0,100)+"...");try{let e=JSON.parse(o);if(console.log("Problem agent response successfully parsed, validating..."),!e.improved_problem_statement)throw console.error("Missing improved_problem_statement in analysis:",JSON.stringify(e)),Error("Invalid analysis structure: missing improved_problem_statement");let t="number"==typeof e.score?e.score:"string"==typeof e.score?parseFloat(e.score):0;(isNaN(t)||t<0||t>10)&&(console.warn(`Invalid score value (${e.score}), defaulting to 5`),t=5);let s=e.reasoning&&"string"==typeof e.reasoning?e.reasoning:"Analysis completed successfully.",r={improved_problem_statement:e.improved_problem_statement,severity_index:e.severity_index||5,problem_framing:"niche"===e.problem_framing?"niche":"global",root_causes:Array.isArray(e.root_causes)?e.root_causes:[],score:t,reasoning:s};return console.log("Problem agent analysis completed successfully"),r}catch(e){throw console.error("Failed to parse OpenAI response:",e),console.error("Raw response (first 500 chars):",o.substring(0,500)),Error(`JSON parsing error: ${e instanceof Error?e.message:"Unknown error"}`)}}catch(r){r instanceof Error&&(r.message.includes("timed out")||r.message.includes("timeout"))?console.error("OpenAI API call timed out. Generating fallback analysis."):console.error("OpenAI API error details:",{message:r instanceof Error?r.message:String(r),name:r instanceof Error?r.name:"Unknown",stack:r instanceof Error?r.stack:"No stack available"}),console.log("Generating fallback analysis due to OpenAI API error");let t=e.user_input.split(" "),s=t.slice(0,15).join(" ")+(t.length>15?"...":"");return{improved_problem_statement:`Problem: ${s}`,severity_index:5,problem_framing:"global",root_causes:["Analysis unavailable due to service limitations"],score:5,reasoning:"Analysis could not be completed due to service limitations. We've provided a simplified assessment of your business idea."}}}catch(t){return console.error("Fatal error in Problem Agent:",t),{improved_problem_statement:e.user_input,severity_index:5,problem_framing:"global",root_causes:[`Unable to analyze due to error: ${t instanceof Error?t.message:"Unknown error"}`],score:5,reasoning:`Analysis failed due to technical issues: ${t instanceof Error?t.message:"Unknown error"}`}}}async function h(e){try{let t=`
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
`;e.user_input,console.log(`Market agent analyzing business context (enhanced problem: ${e.enhanced_problem_statement?.substring(0,50)||"None"}...)`);let s=process.env.OPENAI_API_KEY;console.log(`OpenAI API key status: ${s?"Present":"MISSING"}`);let r=new Promise((e,t)=>{setTimeout(()=>t(Error("Market agent API call timed out after 15000ms")),15e3)}),a=0,o=null;for(;a<=1;)try{a>0&&console.log(`Retrying Market Agent analysis (attempt ${a}/1)`);let e="gpt-3.5-turbo";console.log(`Using OpenAI model for market agent: ${e}`);let s=p.chat.completions.create({model:e,messages:[{role:"system",content:"You are the Market Specialist Agent (The Opportunity Validator). Your role is to analyze market size, growth potential, and validate the market opportunity."},{role:"user",content:t}],temperature:.5,response_format:{type:"json_object"}});console.log("Sending request to OpenAI for market analysis...");let o=await Promise.race([s,r]);console.log("Market agent response received");let i=o.choices[0].message.content;if(!i)throw Error("No response from Market Agent");try{console.log("Parsing market agent response...");let e=JSON.parse(i);return("number"!=typeof e.tam||isNaN(e.tam))&&(e.tam=1e9),("number"!=typeof e.sam||isNaN(e.sam))&&(e.sam=.3*e.tam),("number"!=typeof e.som||isNaN(e.som))&&(e.som=.1*e.sam),e.growth_rate||(e.growth_rate="10-15% annually"),e.market_demand||(e.market_demand="Moderate demand with growing interest"),e.why_now||(e.why_now="Current market conditions are favorable for this solution"),e.score&&"number"==typeof e.score||(e.score=65),e.reasoning||(e.reasoning="Analysis completed with default values"),console.log("Market agent analysis completed successfully"),e}catch(t){let e=t instanceof Error?t.message:"Unknown parsing error";throw console.error("Market Agent returned invalid JSON:",e),console.error("Response content:",i.substring(0,500)),Error(`Market Agent returned invalid JSON: ${e}`)}}catch(e){if(e instanceof Error&&(e.message.includes("timed out")||e.message.includes("timeout"))?console.error("Market agent API call timed out"):console.error("Market agent API error:",e),o=e instanceof Error?e:Error(String(e)),console.error(`Market Agent analysis failed (attempt ${a+1}/2):`,o.message),++a<=1){let e=Math.min(1e3*Math.pow(2,a-1),8e3);console.log(`Waiting ${e}ms before retry...`),await new Promise(t=>setTimeout(t,e))}}return console.log("All Market Agent retries failed, generating fallback analysis"),{tam:1e9,sam:3e8,som:3e7,growth_rate:"Unknown, estimated 10-15%",market_demand:"Unable to determine precisely",why_now:"Current market conditions may be suitable",score:60,reasoning:"Auto-generated due to API processing issues. This is a simplified analysis with estimated market sizes."}}catch(e){return console.error("Fatal error in Market Agent:",e),{tam:1e9,sam:3e8,som:3e7,growth_rate:"Unknown, estimated 10-15%",market_demand:"Unable to determine precisely",why_now:"Current market conditions may be suitable",score:60,reasoning:"Auto-generated due to technical difficulties. This is a simplified analysis with estimated market sizes."}}}async function v(e){let t=`
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
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Competitive Specialist Agent (The Moat Evaluator). Your role is to identify competitors and evaluate the competitive advantage or moat of the business idea."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Competitive Agent");return JSON.parse(s)}async function b(e){let t=`
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
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the UVP Specialist Agent (The Message Refiner). Your role is to craft a clear, compelling unique value proposition for the business idea."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from UVP Agent");return JSON.parse(s)}async function y(e){let t=`
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
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Business Model Specialist Agent (The Monetization Analyst). Your role is to analyze and improve the revenue model and business sustainability."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Business Model Agent");return JSON.parse(s)}async function _(e){let t=`
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
`,s=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the Strategic Metrics Specialist Agent (The Quantifier). Your role is to provide key strategic metrics and forecasts for the business idea."},{role:"user",content:t}],temperature:.7,response_format:{type:"json_object"}})).choices[0].message.content;if(!s)throw Error("No response from Metrics Agent");return JSON.parse(s)}async function x(e,t){let s=function(e,t){let{businessType:s,weights:r}=function(e,t){let s={problem:.15,market:.15,competitive:.15,uvp:.15,business_model:.15,validation:.1,legal:.05,metrics:.1,vc_lead:0},r="General",a={...s},o=(e.user_input||"").toLowerCase(),i=t.problem||{},n=t.business_model||{},l=t.legal||{};return"global"===i.problem_framing||o.includes("social impact")||o.includes("donation")||o.includes("non-profit")||o.includes("charity")?(r="Social Impact",a={...s,problem:.25,legal:.15,business_model:.2,market:.1,competitive:.1,uvp:.1,validation:.05,metrics:.05,vc_lead:0}):o.includes("saas")||o.includes("software")||o.includes("b2b")||o.includes("enterprise")||(n.revenue_model||"").toLowerCase().includes("subscription")?(r="B2B SaaS",a={...s,uvp:.2,market:.2,business_model:.2,problem:.15,competitive:.1,validation:.05,legal:.05,metrics:.05,vc_lead:0}):o.includes("consumer")||o.includes("app")||o.includes("mobile")?(r="Consumer App",a={...s,uvp:.25,validation:.2,problem:.15,market:.15,competitive:.1,business_model:.1,legal:.025,metrics:.025,vc_lead:0}):o.includes("health")||o.includes("medical")||o.includes("patient")||(l.risk_tags||[]).some(e=>e.toLowerCase().includes("health")||e.toLowerCase().includes("medical")||e.toLowerCase().includes("hipaa"))?(r="Healthcare",a={...s,legal:.25,market:.2,validation:.15,problem:.15,business_model:.1,uvp:.05,competitive:.05,metrics:.05,vc_lead:0}):(o.includes("marketplace")||o.includes("platform")||o.includes("connect")||(n.revenue_model||"").toLowerCase().includes("transaction fee")||(n.revenue_model||"").toLowerCase().includes("commission"))&&(r="Marketplace",a={...s,competitive:.2,business_model:.2,market:.15,uvp:.15,problem:.1,validation:.1,legal:.05,metrics:.05,vc_lead:0}),{businessType:r,weights:a}}(e,t);return`
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
`}(e,t),r=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:"You are the VC Lead Agent, responsible for synthesizing all specialist analyses into a comprehensive VC-style report with dynamic weighting based on the nature of the idea."},{role:"user",content:s}],temperature:.5,response_format:{type:"json_object"}})).choices[0].message.content;if(!r)throw Error("No response from VC Lead Agent");return JSON.parse(r)}async function S(e){try{console.log("Processing VC validation submission",e);let t=await (0,i.nn)({businessIdea:e.businessIdea,websiteUrl:e.websiteUrl,...e.additionalContext},"vc_validation");if(!t.success||!t.formId)return{success:!1,message:t.error||"Failed to save validation form"};let s=t.formId;console.log("Validation form saved with ID:",s);let r=await l(s,e.businessIdea);if(!r.success||!r.validationId)return{success:!1,message:r.error||"Failed to create VC validation record"};let n=r.validationId;console.log("VC validation created with ID:",n),await c(n,"in_progress");let p={overall_score:0,business_type:"Analyzing...",weighted_scores:{},category_scores:{},recommendation:"Analysis in progress. Please wait while our AI agents evaluate your business idea.",strengths:[],weaknesses:[],suggested_actions:[],idea_improvements:{original_idea:e.businessIdea,improved_idea:"",problem_statement:"",market_positioning:"",uvp:"",business_model:""},created_at:new Date().toISOString(),updated_at:new Date().toISOString()};try{await u(n,p,0),console.log("Saved initial skeleton report for immediate UI feedback")}catch(e){console.error("Error saving initial skeleton report:",e)}try{let t={improved_problem_statement:e.businessIdea,severity_index:5,problem_framing:"global",root_causes:["Initial analysis in progress..."],score:5,reasoning:"Analysis has started and is being processed in the background."};await d(n,"problem",{businessIdea:e.businessIdea,...e.additionalContext},t,5,t.reasoning,{}),console.log("Saved initial problem agent analysis placeholder")}catch(e){console.error("Error saving initial problem analysis:",e)}await c(n,"processing");try{(function(e,t,s){(async()=>{try{console.log(`[0s] Starting VC validation for business idea: ${t.substring(0,100)}`),t.trim();let{data:r}=await m(e);if(!r||"failed"===r.validation.status){console.error(`Cannot process validation - validation ${e} not found or has failed`);return}try{g(t,s,async(r,a)=>{try{if(!a)return;let o="number"==typeof a.score?Math.round(a.score):"string"==typeof a.score?Math.round(parseFloat(a.score)):5,i=a.reasoning||"Analysis completed with limited information.",n=await d(e,r,{businessIdea:t,...s},a,o,i,{});n.success?console.log(`[AGENT STEP] Saved ${r} agent analysis to database`):console.error(`[AGENT STEP] Error saving ${r} agent analysis:`,n.error)}catch(e){console.error("[AGENT STEP] Error in agent completion callback:",e)}}),console.log("Validation process started, this will likely time out which is expected")}catch(e){console.error("[AGENT STEP] Error starting validation process:",e)}}catch(e){console.error("Background VC validation process error:",e)}})()})(n,e.businessIdea,e.additionalContext||{}),console.log("Started async VC validation process in the background")}catch(e){console.error("Error starting validation process:",e)}return(0,a.revalidatePath)(`/validate/vc-report/${n}`),(0,a.revalidatePath)(`/validate/vc-report/${s}`),console.log(`Redirecting to VC report page - Form ID: ${s}, Validation ID: ${n}`),(0,o.redirect)(`/validate/vc-report/${n}`),{success:!0,formId:s,validationId:n}}catch(e){if(console.error("Error in submitVCValidationForm:",e),e instanceof Error&&e.message.includes("NEXT_REDIRECT"))throw e;return{success:!1,message:e instanceof Error?e.message:"Unknown error"}}}(0,s(33331).D)([S]),(0,r.A)(S,"40d64fb9bfd76b02653ab9ccb41969471bb1655fef",null)},41862:(e,t,s)=>{"use strict";s.d(t,{A:()=>r});let r=(0,s(62688).A)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},44493:(e,t,s)=>{"use strict";s.d(t,{BT:()=>c,Wu:()=>d,ZB:()=>l,Zp:()=>i,aR:()=>n,wL:()=>u});var r=s(60687),a=s(43210),o=s(4780);let i=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("div",{ref:s,className:(0,o.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",e),...t}));i.displayName="Card";let n=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("div",{ref:s,className:(0,o.cn)("flex flex-col space-y-1.5 p-6",e),...t}));n.displayName="CardHeader";let l=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("div",{ref:s,className:(0,o.cn)("text-2xl font-semibold leading-none tracking-tight",e),...t}));l.displayName="CardTitle";let c=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("div",{ref:s,className:(0,o.cn)("text-sm text-muted-foreground",e),...t}));c.displayName="CardDescription";let d=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("div",{ref:s,className:(0,o.cn)("p-6 pt-0",e),...t}));d.displayName="CardContent";let u=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)("div",{ref:s,className:(0,o.cn)("flex items-center p-6 pt-0",e),...t}));u.displayName="CardFooter"},54300:(e,t,s)=>{"use strict";s.d(t,{J:()=>d});var r=s(60687),a=s(43210),o=s(14163),i=a.forwardRef((e,t)=>(0,r.jsx)(o.sG.label,{...e,ref:t,onMouseDown:t=>{t.target.closest("button, input, select, textarea")||(e.onMouseDown?.(t),!t.defaultPrevented&&t.detail>1&&t.preventDefault())}}));i.displayName="Label";var n=s(24224),l=s(4780);let c=(0,n.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=a.forwardRef(({className:e,...t},s)=>(0,r.jsx)(i,{ref:s,className:(0,l.cn)(c(),e),...t}));d.displayName=i.displayName},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},57075:e=>{"use strict";e.exports=require("node:stream")},61410:(e,t,s)=>{"use strict";s.d(t,{default:()=>y});var r=s(60687),a=s(16189),o=s(28947),i=s(41894),n=s(97042),l=s(43210),c=s(44493),d=s(29523),u=s(34729),m=s(54300),p=s(89667),g=s(41862),f=s(20140),h=s(6475);let v=(0,h.createServerReference)("40d64fb9bfd76b02653ab9ccb41969471bb1655fef",h.callServer,void 0,h.findSourceMapURL,"submitVCValidationForm");function b(){let e=(0,a.useRouter)(),[t,s]=(0,l.useState)(!1),[o,i]=(0,l.useState)({businessIdea:"",websiteUrl:"",additionalNotes:""}),[n,h]=(0,l.useState)(!1),[b,y]=(0,l.useState)(!1),_=(e,t)=>{let s={...o,[e]:t};i(s),h(""!==s.businessIdea.trim())},w=async e=>{if(e.preventDefault(),y(!0),o.businessIdea.trim()&&!t){s(!0);try{await v({businessIdea:o.businessIdea,websiteUrl:o.websiteUrl,additionalContext:{additionalNotes:o.additionalNotes}})}catch(e){e instanceof Error&&e.message.includes("NEXT_REDIRECT")||(console.error("Error submitting form:",e),(0,f.o)({title:"Error",description:"An unexpected error occurred. Please try again.",variant:"destructive"}),s(!1))}}};return t?(0,r.jsx)(c.Zp,{className:"p-4 sm:p-6 w-full max-w-full",children:(0,r.jsxs)("div",{className:"flex flex-col items-center justify-center space-y-4 py-8",children:[(0,r.jsx)(g.A,{className:"h-12 w-12 text-primary animate-spin"}),(0,r.jsx)("h3",{className:"text-xl font-semibold",children:"Submitting Form"}),(0,r.jsx)("p",{className:"text-center text-muted-foreground",children:"Redirecting to analysis page..."})]})}):(0,r.jsx)(c.Zp,{className:"p-4 sm:p-6 w-full max-w-full",children:(0,r.jsx)("form",{onSubmit:w,className:"w-full",children:(0,r.jsxs)("div",{className:"space-y-6 w-full",children:[(0,r.jsxs)("div",{className:"space-y-2 w-full",children:[(0,r.jsxs)(m.J,{htmlFor:"businessIdea",className:"flex items-center text-base font-medium",children:["Describe your business idea in detail",(0,r.jsx)("span",{className:"text-red-500 ml-1",children:"*"})]}),(0,r.jsx)("p",{className:"text-sm text-muted-foreground mb-2",children:"Our multi-agent AI system will analyze your idea from multiple specialized perspectives and provide a comprehensive VC-style assessment."}),(0,r.jsx)(u.T,{id:"businessIdea",placeholder:"What problem are you solving and how? Who is your target audience? What is your solution? Provide as much detail as possible for a better assessment.",value:o.businessIdea,onChange:e=>_("businessIdea",e.target.value),rows:8,required:!0,className:"w-full resize-y min-h-[200px]",style:{borderColor:b&&!o.businessIdea.trim()?"rgb(252, 165, 165)":void 0},disabled:t}),b&&!o.businessIdea.trim()&&(0,r.jsx)("p",{className:"text-xs text-red-500",children:"Business idea is required"})]}),(0,r.jsxs)("div",{className:"space-y-2 w-full",children:[(0,r.jsx)(m.J,{htmlFor:"websiteUrl",className:"text-base font-medium",children:"Website URL (Optional)"}),(0,r.jsx)(p.p,{id:"websiteUrl",type:"url",placeholder:"https://example.com",value:o.websiteUrl,onChange:e=>_("websiteUrl",e.target.value),className:"w-full",disabled:t}),(0,r.jsx)("p",{className:"text-xs text-muted-foreground",children:"If you have a website or landing page, our AI can incorporate it into its analysis."})]}),(0,r.jsxs)("div",{className:"space-y-2 w-full",children:[(0,r.jsx)(m.J,{htmlFor:"additionalNotes",className:"text-base font-medium",children:"Additional Context (Optional)"}),(0,r.jsx)(u.T,{id:"additionalNotes",placeholder:"Any other information that might help us understand your business better? Market research, competitors, unique advantages, etc.",value:o.additionalNotes,onChange:e=>_("additionalNotes",e.target.value),rows:4,className:"w-full resize-y",disabled:t}),(0,r.jsx)("p",{className:"text-xs text-muted-foreground",children:"Share any additional context that might help our agents provide better insights."})]}),(0,r.jsxs)("div",{className:"space-y-4 w-full",children:[(0,r.jsxs)("div",{className:"bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800",children:[(0,r.jsx)("h3",{className:"font-medium mb-1",children:"About VC Validation"}),(0,r.jsx)("p",{className:"text-sm",children:"This process uses specialized AI agents to analyze different aspects of your business idea - from problem definition to market analysis, competitive positioning, business model, and legal considerations. Each agent will improve your idea and provide a score. The lead agent will then synthesize these insights into a final VC-style report."})]}),(0,r.jsxs)("div",{className:"flex justify-between w-full",children:[(0,r.jsx)(d.$,{type:"button",variant:"outline",onClick:()=>e.push("/validate"),disabled:t,children:"Back"}),(0,r.jsx)(d.$,{type:"submit",disabled:t||b&&!n,children:t?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(g.A,{className:"mr-2 h-4 w-4 animate-spin"}),"Initiating Analysis..."]}):"Submit for VC Validation"})]})]})]})})})}function y(){let e=(0,a.useRouter)();return(0,r.jsxs)(n.M,{children:[(0,r.jsx)("header",{className:"sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",children:(0,r.jsxs)("div",{className:"container flex h-16 items-center justify-between px-4",children:[(0,r.jsxs)("div",{className:"flex items-center gap-2 cursor-pointer",onClick:()=>e.push("/"),children:[(0,r.jsx)(o.A,{className:"h-6 w-6 text-primary"}),(0,r.jsx)("span",{className:"text-xl font-bold",children:"Startup Validator"})]}),(0,r.jsx)("div",{className:"flex items-center gap-4",children:(0,r.jsx)(i.U,{})})]})}),(0,r.jsx)("main",{className:"flex-1 container py-10 px-4",children:(0,r.jsxs)("div",{className:"max-w-3xl mx-auto w-full",children:[(0,r.jsxs)("div",{className:"mb-8 text-center",children:[(0,r.jsx)("h1",{className:"text-2xl sm:text-3xl font-bold tracking-tighter mb-2",children:"VC-Style Multi-Agent Validation"}),(0,r.jsx)("p",{className:"text-muted-foreground",children:"Get a comprehensive VC-style analysis from our specialized AI agents"})]}),(0,r.jsx)(b,{})]})})]})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},87714:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>d,routeModule:()=>m,tree:()=>c});var r=s(65239),a=s(48088),o=s(88170),i=s.n(o),n=s(30893),l={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);s.d(t,l);let c={children:["",{children:["validate",{children:["vc-validation",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,23703)),"/Users/artfct/Documents/Software Business/startup-validator/src/app/validate/vc-validation/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,94431)),"/Users/artfct/Documents/Software Business/startup-validator/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.bind(s,54413)),"/Users/artfct/Documents/Software Business/startup-validator/src/app/not-found.tsx"],forbidden:[()=>Promise.resolve().then(s.t.bind(s,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(s.t.bind(s,65284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,d=["/Users/artfct/Documents/Software Business/startup-validator/src/app/validate/vc-validation/page.tsx"],u={require:s,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/validate/vc-validation/page",pathname:"/validate/vc-validation",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},89667:(e,t,s)=>{"use strict";s.d(t,{p:()=>i});var r=s(60687),a=s(43210),o=s(4780);let i=a.forwardRef(({className:e,type:t,...s},a)=>(0,r.jsx)("input",{type:t,className:(0,o.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:a,...s}));i.displayName="Input"},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},99777:(e,t,s)=>{Promise.resolve().then(s.bind(s,34647))}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[447,824,864,461,353,505,134],()=>s(87714));module.exports=r})();