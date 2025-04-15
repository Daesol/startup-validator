(()=>{var e={};e.id=842,e.ids=[842],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33116:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>v,routeModule:()=>d,serverHooks:()=>m,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>l});var s={};t.r(s),t.d(s,{POST:()=>p});var i=t(96559),o=t(48088),a=t(37719),n=t(32190);let u=new(t(69905)).Ay({apiKey:process.env.OPENAI_API_KEY});async function p(e){try{let{businessIdea:r}=await e.json();if(!r)return n.NextResponse.json({error:"Business idea is required"},{status:400});let t=`
      I need help improving a business idea to make it more suitable for a comprehensive validation report.
      The improved version will be used to generate a detailed investor-focused validation analysis.
      
      Please enhance the following business idea by adding:
      
      1. A clear target audience definition
      2. A specific problem statement
      3. A detailed solution approach
      4. A brief note on market opportunity
      5. Any unique value proposition or competitive advantage
      
      Original Business Idea:
      "${r.trim()}"
      
      Please provide an improved version that integrates these elements while maintaining the core concept.
      Don't add placeholders like [Target Audience] but actually enhance the idea with specific details.
      Format the improved idea in clear paragraphs with line breaks between sections.
      The improved idea should be comprehensive yet concise (under 500 words).
      
      The improvements should help generate a more accurate and valuable validation report.
    `,s=await u.chat.completions.create({messages:[{role:"user",content:t}],model:"gpt-3.5-turbo",temperature:.7,max_tokens:800}),i=s.choices[0]?.message?.content?.trim()||r;return n.NextResponse.json({improvedIdea:i})}catch(e){return console.error("Error improving business idea:",e),n.NextResponse.json({error:"Failed to improve business idea"},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/improve-idea/route",pathname:"/api/improve-idea",filename:"route",bundlePath:"app/api/improve-idea/route"},resolvedPagePath:"/Users/tammyartawong/Documents/Foundr Club/startup-validator/src/app/api/improve-idea/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:c,workUnitAsyncStorage:l,serverHooks:m}=d;function v(){return(0,a.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:l})}},33873:e=>{"use strict";e.exports=require("path")},37830:e=>{"use strict";e.exports=require("node:stream/web")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55591:e=>{"use strict";e.exports=require("https")},57075:e=>{"use strict";e.exports=require("node:stream")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},73024:e=>{"use strict";e.exports=require("node:fs")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},96487:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[447,570,580,905],()=>t(33116));module.exports=s})();