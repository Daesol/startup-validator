"use client"

import React, { useState, useEffect } from "react"
import { VCValidationWithAnalyses, VCAgentType } from "@/lib/supabase/types"
import { HeaderSection } from "./header-section"
import { IdeaImprovements } from "./idea-improvements"
import { CategoryScores } from "./category-scores"
import { StrengthsWeaknesses } from "./strengths-weaknesses"
import { SuggestedActions } from "./suggested-actions"
import { ReportNav } from "./report-nav"
import { ReportFooter } from "./report-footer"
import { AgentAnalysesSection } from "./agent-analyses-section"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface VCReportProps {
  validation: VCValidationWithAnalyses
}

export function VCReport({ validation }: VCReportProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(60);
  
  // Get the VC report
  const vcReport = validation.validation.vc_report;
  
  // Log diagnostic info
  console.log("VC Report data:", {
    form_id: validation.form.id,
    business_idea: validation.form.business_idea?.substring(0, 50) + "...",
    status: validation.validation.status,
    score: validation.validation.score,
    agents: validation.agent_analyses.length
  });
  
  // Additional debug logging for agent analyses
  console.log("Agent analyses details:", {
    count: validation.agent_analyses.length,
    hasAgentData: validation.agent_analyses.length > 0,
    agentTypes: validation.agent_analyses.map(agent => agent.agent_type),
    firstAgentSample: validation.agent_analyses.length > 0 ? {
      type: validation.agent_analyses[0].agent_type,
      score: validation.agent_analyses[0].score,
      hasAnalysis: !!validation.agent_analyses[0].analysis,
      analysisKeys: validation.agent_analyses[0].analysis ? Object.keys(validation.agent_analyses[0].analysis) : []
    } : null
  });
  
  console.log("VC Report structure:", {
    hasStrengths: !!vcReport.strengths && vcReport.strengths.length > 0,
    hasWeaknesses: !!vcReport.weaknesses && vcReport.weaknesses.length > 0,
    hasCategoryScores: !!vcReport.category_scores && Object.keys(vcReport.category_scores).length > 0,
    hasIdeas: !!vcReport.idea_improvements,
    hasActions: !!vcReport.suggested_actions && vcReport.suggested_actions.length > 0
  });
  
  // Extract original and improved ideas
  const originalIdea = (vcReport.idea_improvements && vcReport.idea_improvements.original_idea) || 
    validation.form.business_idea || "";
  const improvedIdea = (vcReport.idea_improvements && vcReport.idea_improvements.improved_idea) || "";
  
  // Define all expected agent types
  const expectedAgentTypes = [
    'problem', 'market', 'competitive', 'uvp', 
    'business_model', 'validation', 'legal', 'metrics'
  ] as VCAgentType[];
  
  // Check if all agents have complete analysis data
  const hasAllAgentTypes = expectedAgentTypes.every(type => 
    validation.agent_analyses.some(agent => agent.agent_type === type)
  );
  
  // Check if all agents have analysis data
  const allAgentsHaveData = validation.agent_analyses.every(agent => {
    // Check if agent has analysis data
    if (!agent.analysis || Object.keys(agent.analysis).length === 0 || !agent.reasoning) {
      return false;
    }
    
    // Check if agent response has a "processing" status
    if (
      agent.analysis.status === "processing" || 
      (validation.validation.agent_responses && 
       validation.validation.agent_responses[agent.agent_type] && 
       validation.validation.agent_responses[agent.agent_type].status === "processing")
    ) {
      return false;
    }
    
    // Check for expected fields based on agent type
    switch (agent.agent_type) {
      case 'problem':
        return !!agent.analysis.improved_problem_statement && 
               !!agent.analysis.root_causes && 
               agent.analysis.severity_index !== undefined;
      case 'market':
        return !!agent.analysis.tam && 
               !!agent.analysis.sam && 
               !!agent.analysis.som;
      case 'competitive':
        return !!agent.analysis.competitors && 
               !!agent.analysis.differentiation;
      case 'uvp':
        return !!agent.analysis.one_liner;
      case 'business_model':
        return !!agent.analysis.revenue_model;
      case 'validation':
        return !!agent.analysis.current_validation;
      case 'legal':
        return !!agent.analysis.friction_points;
      case 'metrics':
        return !!agent.analysis.scalability_index !== undefined;
      default:
        return true;
    }
  });
  
  // Check for processing status in agent_responses
  const hasProcessingAgents = validation.validation.agent_responses && 
    Object.values(validation.validation.agent_responses).some(
      response => response && typeof response === 'object' && response.status === "processing"
    );
    
  // Detect edge case where agent_analyses shows agents but agent_responses shows processing
  const hasDataMismatch = validation.agent_analyses.length > 0 && hasProcessingAgents;
  
  // Log inconsistencies if they exist
  if (hasDataMismatch) {
    console.warn('Detected mismatch between agent_analyses and agent_responses:', {
      agent_analyses_count: validation.agent_analyses.length,
      agent_responses_processing: Object.entries(validation.validation.agent_responses || {})
        .filter(([_, value]) => value && typeof value === 'object' && value.status === 'processing')
        .map(([key]) => key)
    });
  }

  // Check if report data is complete
  const hasCompleteReportData = 
    vcReport && 
    vcReport.overall_score !== undefined && 
    vcReport.category_scores && 
    Object.keys(vcReport.category_scores).length > 0 &&
    vcReport.strengths && 
    vcReport.strengths.length > 0 &&
    vcReport.weaknesses && 
    vcReport.weaknesses.length > 0;
  
  // Determine if we should show the full report or loading state
  // Now also account for processing status in agent_responses
  const isProcessingComplete = hasAllAgentTypes && allAgentsHaveData && hasCompleteReportData && !hasProcessingAgents;
  
  // Check what agents are missing data
  const missingAgentTypes = expectedAgentTypes.filter(type => 
    !validation.agent_analyses.some(agent => agent.agent_type === type)
  );
  
  const incompleteAgents = validation.agent_analyses.filter(agent => 
    !agent.analysis || Object.keys(agent.analysis).length === 0 || !agent.reasoning
  );
  
  // Calculate report completeness percentage
  useEffect(() => {
    // Base progress is 60% (just for showing the agent is running)
    let progress = 60;
    
    // Check agents in agent_responses marked as processing
    const processingAgentTypes = validation.validation.agent_responses ? 
      Object.entries(validation.validation.agent_responses)
        .filter(([_, value]) => value && typeof value === 'object' && value.status === 'processing')
        .map(([key]) => key) 
      : [];
    
    // Add 20% if we have all agent types
    if (hasAllAgentTypes) {
      progress += 20;
    } else {
      // Add partial progress based on how many agent types we have
      const agentTypesCompletedCount = expectedAgentTypes.filter(type => 
        validation.agent_analyses.some(agent => agent.agent_type === type)
      ).length;
      progress += Math.round((agentTypesCompletedCount / expectedAgentTypes.length) * 20);
    }
    
    // Add 10% if all agents have analysis data
    if (allAgentsHaveData) {
      progress += 10;
    } else if (validation.agent_analyses.length > 0) {
      // Add partial progress based on how many agents have complete data
      const completeAgentsCount = validation.agent_analyses.filter(agent => 
        agent.analysis && 
        Object.keys(agent.analysis).length > 0 && 
        agent.reasoning &&
        !processingAgentTypes.includes(agent.agent_type) // Don't count agents still processing
      ).length;
      
      const nonProcessingCount = expectedAgentTypes.length - processingAgentTypes.length;
      const divisor = nonProcessingCount > 0 ? nonProcessingCount : expectedAgentTypes.length;
      
      progress += Math.round((completeAgentsCount / divisor) * 10);
    }
    
    // Add 10% if report data is complete
    if (hasCompleteReportData) {
      progress += 10;
    }
    
    // Ensure progress never exceeds 95% while agents are still processing
    if (processingAgentTypes.length > 0 && progress > 95) {
      progress = 95;
    }
    
    setProcessingProgress(progress);
    
    // Set loading state based on report completeness
    setIsLoading(!isProcessingComplete);
    
    // Auto refresh after 10 seconds if still loading
    let timeoutId: NodeJS.Timeout;
    if (!isProcessingComplete) {
      timeoutId = setTimeout(() => {
        console.log("Auto-refreshing report to check for updates...");
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 10000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [validation, hasAllAgentTypes, allAgentsHaveData, hasCompleteReportData, isProcessingComplete, expectedAgentTypes]);
  
  // Refresh the page to try loading the latest data
  const handleRefresh = () => {
    console.log("Refreshing page to get latest agent data");
    router.refresh();
    // Force a hard refresh to bypass cache
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  
  // Get list of agents still processing
  const processingAgentTypes = validation.validation.agent_responses ? 
    Object.entries(validation.validation.agent_responses)
      .filter(([_, value]) => value && typeof value === 'object' && value.status === 'processing')
      .map(([key]) => key)
    : [];
    
  // Update the loading state UI with this info
  if (isLoading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <ReportNav />
        
        <div className="container py-8 max-w-5xl mx-auto">
          <Card className="border shadow-sm mb-8">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">Multi-Agent Analysis Report</CardTitle>
              <CardDescription>
                Your report is still being processed
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h2 className="text-xl font-semibold mb-2">Processing Agent Analysis Data</h2>
                <p className="text-center text-muted-foreground mb-6 max-w-md">
                  The AI agents are still completing their analysis of your business idea. 
                  This typically takes about 1-2 minutes.
                </p>
                
                <div className="w-full max-w-md mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Processing...</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
                
                {/* Show alert for processing agents from agent_responses */}
                {processingAgentTypes.length > 0 && (
                  <div className="w-full max-w-md mb-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                    <div className="flex items-start gap-2">
                      <Loader2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0 animate-spin" />
                      <div>
                        <h3 className="font-medium text-sm text-blue-800 dark:text-blue-400">Agents currently processing</h3>
                        <div className="mt-1 text-xs text-blue-700 dark:text-blue-500">
                          <p className="capitalize">{processingAgentTypes.map(type => type.replace('_', ' ')).join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Show missing or incomplete agents */}
                {(missingAgentTypes.length > 0 || incompleteAgents.length > 0) && (
                  <div className="w-full max-w-md mb-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm text-amber-800 dark:text-amber-400">Waiting for agent data</h3>
                        <div className="mt-1 text-xs text-amber-700 dark:text-amber-500">
                          {missingAgentTypes.length > 0 && (
                            <p>Missing agent types: {missingAgentTypes.join(', ')}</p>
                          )}
                          {incompleteAgents.length > 0 && (
                            <p>Incomplete agent data: {incompleteAgents.map(a => a.agent_type).join(', ')}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button onClick={handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Show partial report data while loading */}
          {vcReport && vcReport.overall_score && (
            <div className="opacity-70">
              <HeaderSection 
                businessType={vcReport.business_type || "Business"} 
                overallScore={vcReport.overall_score || 'N/A'}
                createdAt={vcReport.created_at}
                categoryScores={vcReport.category_scores || {}}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Show complete report when data is ready
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top Navigation Bar */}
      <ReportNav />

      <div className="container py-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Header Section */}
          <HeaderSection 
            businessType={vcReport.business_type || "Business"} 
            overallScore={vcReport.overall_score || 'N/A'}
            createdAt={vcReport.created_at}
            categoryScores={vcReport.category_scores || {}}
          />
          
          {/* Improved Business Idea Section */}
          <IdeaImprovements 
            originalIdea={originalIdea}
            improvedIdea={improvedIdea}
          />
          
          {/* Category Scores */}
          <CategoryScores 
            categoryScores={vcReport.category_scores || {}}
          />
          
          {/* Strengths & Weaknesses */}
          <StrengthsWeaknesses 
            strengths={vcReport.strengths || []}
            weaknesses={vcReport.weaknesses || []}
          />
          
          {/* Agent Analyses */}
          <AgentAnalysesSection agents={validation.agent_analyses} />
          
          {/* Suggested Actions */}
          <SuggestedActions 
            actions={vcReport.suggested_actions || []}
          />
          
          {/* Footer */}
          <ReportFooter createdAt={vcReport.created_at} />
        </div>
      </div>
    </div>
  )
} 