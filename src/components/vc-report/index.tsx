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
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold leading-none">{vcReport.business_type} Analysis</h1>
                    <Badge variant="secondary" className="rounded-sm">
                      {typeof vcReport.overall_score === 'string' 
                        ? Math.round(parseFloat(vcReport.overall_score)) 
                        : Math.round(vcReport.overall_score)}/100
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Multi-Agent VC Analysis | {vcReport.created_at ? new Date(vcReport.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">Overall Score</div>
                    <div className="text-2xl font-bold">
                      {typeof vcReport.overall_score === 'string' 
                        ? Math.round(parseFloat(vcReport.overall_score)) 
                        : Math.round(vcReport.overall_score)}
                    </div>
                  </div>
                  <Progress 
                    value={typeof vcReport.overall_score === 'string' 
                      ? parseFloat(vcReport.overall_score) 
                      : vcReport.overall_score} 
                    className="h-2 w-24" 
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Idea Type</div>
                  <div className="font-medium">{vcReport.business_type}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Recommendation</div>
                  <div className="font-medium">
                    {vcReport.recommendation && vcReport.recommendation.length > 50 
                      ? vcReport.recommendation.substring(0, 50) + "..." 
                      : vcReport.recommendation || "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Analyzed By</div>
                  <div className="font-medium">8 Specialist AI Agents</div>
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
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Category Scores</CardTitle>
              <CardDescription>Analysis breakdown by specialist agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(vcReport.category_scores || {}).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium capitalize">
                        {category.replace('_', ' ')}
                      </div>
                      <div className="text-sm">{score}/10</div>
                    </div>
                    <Progress value={score * 10} className="h-2" />
                  </div>
                ))}
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
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Specialist Agent Analyses</CardTitle>
              <CardDescription>
                Each aspect of your business was analyzed by a specialized AI agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="problem" className="w-full">
                <TabsList className="w-full grid grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="problem">Problem</TabsTrigger>
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="competition">Competition</TabsTrigger>
                  <TabsTrigger value="uvp">UVP</TabsTrigger>
                  <TabsTrigger value="business">Business Model</TabsTrigger>
                  <TabsTrigger value="validation">Validation</TabsTrigger>
                  <TabsTrigger value="legal">Legal</TabsTrigger>
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                </TabsList>
                
                {validation.agent_analyses.map(agent => (
                  <TabsContent key={agent.id} value={agent.agent_type} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold capitalize">{agent.agent_type} Analysis</h3>
                      <Badge>{agent.score}/10</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(agent.analysis).filter(([key]) => !['score', 'reasoning'].includes(key)).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <h4 className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</h4>
                          <div className="text-sm">
                            {typeof value === 'string' 
                              ? value
                              : Array.isArray(value)
                                ? value.map((item, i) => <div key={i} className="mb-1">{item}</div>)
                                : typeof value === 'object' && value !== null
                                  ? <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                                  : String(value)
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium">Agent Reasoning</h4>
                      <p className="text-sm text-muted-foreground">{agent.reasoning}</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          
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