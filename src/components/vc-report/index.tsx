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

interface VCReportProps {
  validation: VCValidationWithAnalyses
}

export function VCReport({ validation }: VCReportProps) {
  // Add logging to verify data
  console.log("VC Report data:", {
    form_id: validation.form.id,
    business_idea: validation.form.business_idea?.substring(0, 50) + "...",
    status: validation.validation.status,
    score: validation.validation.score,
    agents: validation.agent_analyses.length
  });
  
  // Get the VC report
  const vcReport = validation.validation.vc_report;
  
  // Extract original and improved ideas
  const originalIdea = (vcReport.idea_improvements && vcReport.idea_improvements.original_idea) || 
    validation.form.business_idea || "";
  const improvedIdea = (vcReport.idea_improvements && vcReport.idea_improvements.improved_idea) || "";
  
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top Navigation Bar */}
      <ReportNav />

      <div className="container py-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Header Section */}
          <HeaderSection 
            businessType={vcReport.business_type || "Business"} 
            overallScore={vcReport.overall_score || 0}
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
          {validation.agent_analyses && validation.agent_analyses.length > 0 && (
            <AgentAnalysesSection agents={validation.agent_analyses} />
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