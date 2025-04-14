"use client"

import React, { useState } from "react"
import { VCValidationWithAnalyses } from "@/lib/supabase/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Printer } from "lucide-react"
import Link from "next/link"
import { SpecialistAgentNav } from "@/components/specialist-agent-nav"
import { AgentAnalysesSection } from "@/components/vc-report/agent-analyses-section"

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
  
  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/validate">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Header Section */}
          <Card className="border shadow-md bg-gradient-to-r from-primary/5 to-background overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <CardHeader className="pb-3 relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold leading-none text-primary">{vcReport.business_type} Analysis</h1>
                    <Badge variant="outline" className="rounded-full px-3 py-0.5 bg-primary/10 text-primary font-semibold text-base">
                      {typeof vcReport.overall_score === 'string' 
                        ? Math.round(parseFloat(vcReport.overall_score)) 
                        : Math.round(vcReport.overall_score)}/100
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Multi-Agent VC Analysis | {vcReport.created_at ? new Date(vcReport.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-right mb-2">
                    <div className="text-sm font-medium">Overall Score</div>
                    <div className="text-3xl font-bold text-primary">
                      {typeof vcReport.overall_score === 'string' 
                        ? Math.round(parseFloat(vcReport.overall_score)) 
                        : Math.round(vcReport.overall_score)}
                    </div>
                  </div>
                  <div className="w-full max-w-[160px]">
                    <Progress 
                      value={typeof vcReport.overall_score === 'string' 
                        ? parseFloat(vcReport.overall_score) 
                        : vcReport.overall_score} 
                      className="h-3 w-full" 
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 p-4 bg-background/80 rounded-md shadow-sm">
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="text-primary">💡</span>
                    <span>Idea Type</span>
                  </div>
                  <div className="font-semibold text-lg">{vcReport.business_type}</div>
                </div>
                <div className="space-y-2 p-4 bg-background/80 rounded-md shadow-sm">
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="text-primary">🎯</span>
                    <span>Recommendation</span>
                  </div>
                  <div className="font-semibold text-lg">
                    {vcReport.recommendation && vcReport.recommendation.length > 50 
                      ? vcReport.recommendation.substring(0, 50) + "..." 
                      : vcReport.recommendation || "N/A"}
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-background/80 rounded-md shadow-sm">
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <span className="text-primary">🤖</span>
                    <span>Analyzed By</span>
                  </div>
                  <div className="font-semibold text-lg">8 Specialist AI Agents</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Improved Business Idea Section */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Idea Improvements</CardTitle>
              <CardDescription>Our AI agents have improved your business idea</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Original Idea</h3>
                <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {(vcReport.idea_improvements && vcReport.idea_improvements.original_idea) || validation.form.business_idea}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Improved Idea</h3>
                <div className="bg-primary/10 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {(vcReport.idea_improvements && vcReport.idea_improvements.improved_idea) || "No improvements suggested."}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Category Scores */}
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-primary/10 text-primary">📊</span>
                Category Scores
              </CardTitle>
              <CardDescription>Analysis breakdown by specialist agents</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Object.entries(vcReport.category_scores || {}).map(([category, score]) => {
                  // Define color based on score
                  const colorClass = score >= 8 
                    ? "text-green-500 border-green-200 bg-green-50" 
                    : score >= 6 
                      ? "text-amber-500 border-amber-200 bg-amber-50" 
                      : "text-red-500 border-red-200 bg-red-50";
                      
                  // Calculate percentage for circular progress
                  const percentage = score * 10;
                  const circumference = 2 * Math.PI * 38; // Circle radius is 38
                  const strokeDashoffset = circumference - (percentage / 100) * circumference;
                  
                  return (
                    <div key={category} className={`rounded-lg border p-4 flex flex-col items-center ${colorClass}`}>
                      <div className="relative w-[100px] h-[100px] mb-2">
                        {/* Background circle */}
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="38" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="8" 
                            strokeOpacity="0.2" 
                          />
                          {/* Progress circle */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="38" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="8" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={strokeDashoffset} 
                            strokeLinecap="round" 
                            transform="rotate(-90 50 50)" 
                          />
                        </svg>
                        {/* Score text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{score}</span>
                        </div>
                      </div>
                      <div className="font-medium text-center capitalize">
                        {category.replace(/_/g, ' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {vcReport.strengths?.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 text-lg leading-tight">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Weaknesses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {vcReport.weaknesses?.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 text-lg leading-tight">⚠</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Agent Analyses */}
          {validation.agent_analyses && validation.agent_analyses.length > 0 && (
            <div className="col-span-1 xl:col-span-2">
              <AgentAnalysesSection agents={validation.agent_analyses} />
            </div>
          )}
          
          {/* Suggested Actions */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Next Steps</CardTitle>
              <CardDescription>Suggested actions to improve your business</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {vcReport.suggested_actions?.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 text-primary h-6 w-6 flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>{action}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>VC Multi-Agent Validation Report | Generated on {vcReport.created_at ? new Date(vcReport.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 