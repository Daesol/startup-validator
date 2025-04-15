import { processNextAgent } from "@/features/validation/actions/process-vc-validation-async";
import { VCAgentType } from "@/lib/supabase/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { validationId, agentType, businessIdea, additionalContext } = body;
    
    // Validate required fields
    if (!validationId || !businessIdea) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    console.log(`[API] Processing agent ${agentType} for validation ${validationId}`);
    

    await processNextAgent(
        validationId,
        agentType as VCAgentType,
        businessIdea,
        additionalContext || {}
    );
   

    
    // Return immediate success response
    return NextResponse.json({ 
      success: true, 
      message: `Agent ${agentType} processing initiated`,
  

    });
  } catch (error) {
    console.error("[API] Error in process-agent API route:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}