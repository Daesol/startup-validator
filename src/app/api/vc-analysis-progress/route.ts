import { NextRequest, NextResponse } from 'next/server';
import { getVCValidationWithAnalyses, addAgentAnalysis, updateVCValidationStatus, setVCReport } from '@/lib/supabase/vc-validation-service';
import { runVCValidation } from '@/lib/ai/vc-validation/vc-analyzer';
import type { VCAgentType, VCValidationStatus } from '@/lib/supabase/types';

// The list of agents to run in order
const AGENT_ORDER: VCAgentType[] = [
  'problem',
  'market',
  'competitive',
  'uvp',
  'business_model',
  'validation',
  'legal',
  'metrics'
];

// This API route is used to check the status of a VC validation
// and trigger the next agent in the process if needed
export async function GET(req: NextRequest) {
  try {
    // Get validation ID from URL parameter
    const url = new URL(req.url);
    const validationId = url.searchParams.get('id');
    const triggerNext = url.searchParams.get('triggerNext') === 'true';
    
    if (!validationId) {
      return NextResponse.json(
        { success: false, error: 'Missing validation ID' },
        { status: 400 }
      );
    }
    
    // Get the validation with its analyses
    const result = await getVCValidationWithAnalyses(validationId);
    
    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Validation not found' },
        { status: 404 }
      );
    }
    
    const validation = result.data;
    
    // If validation is already completed, just return the data
    if ((validation.validation.status as string) === 'completed' || (validation.validation.status as string) === 'completed_with_errors') {
      return NextResponse.json({
        success: true,
        data: validation,
        status: 'completed',
        nextAgent: null
      });
    }
    
    // Calculate which agents have been completed
    const completedAgentTypes = validation.agent_analyses.map(a => a.agent_type);
    
    // Find the next agent to process
    const nextAgent = AGENT_ORDER.find(agent => !completedAgentTypes.includes(agent));
    
    // Check if all agents have been completed
    const allAgentsCompleted = !nextAgent && AGENT_ORDER.every(agent => completedAgentTypes.includes(agent));
    
    // If all agents are completed but status isn't completed yet
    if (allAgentsCompleted && validation.validation.status !== 'completed') {
      // Check if we have enough data to generate a report
      if (triggerNext) {
        // Generate a simple final report from the agent analyses
        const basicReport = {
          overall_score: 65,
          business_type: "Startup",
          weighted_scores: {},
          category_scores: {},
          recommendation: "Based on our analysis, your business idea shows potential.",
          strengths: ["Your idea has been analyzed by our AI agents"],
          weaknesses: [],
          suggested_actions: ["Review the detailed agent analyses for specific feedback"],
          idea_improvements: {
            original_idea: validation.form.business_idea || "",
            improved_idea: "",
            problem_statement: "",
            market_positioning: "",
            uvp: "",
            business_model: ""
          },
          partial_completion: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Save the final report
        await setVCReport(validationId, basicReport, 65);
        
        // Update status to completed
        await updateVCValidationStatus(validationId, "completed");
        
        // Get the updated validation
        const updatedResult = await getVCValidationWithAnalyses(validationId);
        
        return NextResponse.json({
          success: true,
          data: updatedResult.data,
          status: 'completed',
          nextAgent: null,
          action: 'generated_final_report'
        });
      }
      
      return NextResponse.json({
        success: true,
        data: validation,
        status: 'needs_final_report',
        nextAgent: null
      });
    }
    
    // If we need to trigger the next agent and there is one
    if (triggerNext && nextAgent) {
      // Start the next agent processing
      // Note: We don't await this - it's meant to timeout and continue in the background
      // But the initial processing will be captured
      try {
        // Create a placeholder for the agent
        const placeholderAnalysis = {
          status: "processing",
          agent_type: nextAgent,
          message: `${nextAgent} analysis in progress`
        };
        
        // Add a placeholder entry to show progress
        await addAgentAnalysis(
          validationId,
          nextAgent,
          { businessIdea: validation.form.business_idea || "" },
          placeholderAnalysis,
          5,
          "Processing started",
          {}
        );
        
        // Start the agent processing
        // This will timeout but will continue in the background
        // Each agent creates its own single LLM call
        const processPromise = startSingleAgentProcessing(
          validationId, 
          nextAgent, 
          validation
        );
        
        // We don't await this - it's okay for it to continue processing after this request completes
        
        return NextResponse.json({
          success: true,
          data: validation,
          status: 'processing',
          nextAgent,
          action: 'started_agent_processing'
        });
      } catch (error) {
        console.error("Error starting agent processing:", error);
        return NextResponse.json({
          success: true,
          data: validation,
          status: 'error',
          nextAgent,
          error: error instanceof Error ? error.message : 'Unknown error',
          action: 'failed_to_start_processing'
        });
      }
    }
    
    // Return the current status
    return NextResponse.json({
      success: true,
      data: validation,
      status: validation.validation.status,
      nextAgent,
      agentCount: validation.agent_analyses.length,
      completedAgents: completedAgentTypes
    });
  } catch (error) {
    console.error('Error in VC analysis progress API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// This function starts a single agent processing step
// It's okay for this to timeout since the agent will save its result when done
async function startSingleAgentProcessing(
  validationId: string,
  agentType: VCAgentType,
  validation: any
) {
  try {
    // Set up a callback to save the agent result
    const onAgentComplete = async (type: VCAgentType, analysis: any) => {
      if (type !== agentType) return; // Only save the agent we're processing
      
      try {
        if (!analysis) return;
        
        // Extract the score and reasoning
        const score = typeof analysis.score === 'number' 
          ? Math.round(analysis.score) 
          : (typeof analysis.score === 'string' ? Math.round(parseFloat(analysis.score)) : 5);
        const reasoning = analysis.reasoning || "Analysis completed with limited information.";
        
        // Save the agent analysis
        const agentResult = await addAgentAnalysis(
          validationId,
          agentType,
          { businessIdea: validation.form.business_idea }, // Input context
          analysis, // The analysis result
          score,
          reasoning,
          {} // Enhanced context (empty for now)
        );
        
        if (agentResult.success) {
          console.log(`Saved ${agentType} agent analysis to database`);
        } else {
          console.error(`Error saving ${agentType} agent analysis:`, agentResult.error);
        }
      } catch (error) {
        console.error(`Error in agent completion callback:`, error);
      }
    };
    
    // Construct input context from existing analyses
    const context: Record<string, any> = {
      user_input: validation.form.business_idea
    };
    
    // Add the outputs of previous agents to the context
    for (const analysis of validation.agent_analyses) {
      context[`${analysis.agent_type}_analysis`] = analysis.analysis;
    }
    
    // Start the validation process focused on just one agent
    // This will trigger the agent's processing and return the result through the callback
    const promise = runVCValidation(
      validation.form.business_idea,
      { 
        targetAgent: agentType,
        ...context
      },
      onAgentComplete
    );
    
    // We don't await this - it will continue in the background
    // and save its result through the callback
    
    return true;
  } catch (error) {
    console.error(`Error starting ${agentType} agent processing:`, error);
    return false;
  }
} 