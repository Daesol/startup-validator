"use client"

import React from "react"
import { VCValidationWithAnalyses } from "@/lib/supabase/types"
import { HeaderSection } from "./header-section"
import { IdeaImprovements } from "./idea-improvements"
import { CategoryScores } from "./category-scores"
import { StrengthsWeaknesses } from "./strengths-weaknesses"
import { SuggestedActions } from "./suggested-actions"
import { ReportNav } from "./report-nav"
import { ReportFooter } from "./report-footer"
import { AgentAnalysesSection } from "./agent-analyses-section"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface VCReportProps {
  validation: VCValidationWithAnalyses
}

export function VCReport({ validation }: VCReportProps) {
  const router = useRouter();
  
  // Add logging to verify data
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
  
  // Get the VC report
  const vcReport = validation.validation.vc_report;
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
  
  // Check for empty or incomplete agent data
  const hasValidAgentData = validation.agent_analyses && 
                          validation.agent_analyses.length > 0 && 
                          validation.agent_analyses.some(agent => 
                              agent.analysis && 
                              Object.keys(agent.analysis).length > 0);
  
  // Refresh the page to try loading the latest data
  const handleRefresh = () => {
    console.log("Refreshing page to get latest agent data");
    router.refresh();
    // Force a hard refresh to bypass cache
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  
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
          {hasValidAgentData ? (
            <AgentAnalysesSection agents={validation.agent_analyses} />
          ) : (
            <Card className="border shadow-sm">
              <CardHeader className="border-b">
                <CardTitle className="text-xl font-bold">Specialist Agent Analyses</CardTitle>
                <CardDescription>
                  Detailed agent analysis data is still processing
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-4" />
                <p className="text-center text-muted-foreground mb-4">
                  The specialist agent analyses are still being prepared. 
                  <br />You can check back soon to see the detailed breakdown.
                </p>
                <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Data</span>
                </Button>
              </CardContent>
            </Card>
          )}
          
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