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
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Specialist Agent Analyses</CardTitle>
              <CardDescription>
                Each aspect of your business was analyzed by a specialized AI agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="problem" className="w-full">
                <TabsList className="w-full flex flex-wrap">
                  <TabsTrigger value="problem" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">🔍</span>
                      <span>Problem</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="market" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">📊</span>
                      <span>Market</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="competitive" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">🏆</span>
                      <span>Competition</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="uvp" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">⭐</span>
                      <span>UVP</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="business_model" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">💼</span>
                      <span>Business Model</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="validation" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">✅</span>
                      <span>Validation</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">⚖️</span>
                      <span>Legal</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="flex-1 min-w-[150px] px-4 py-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">📈</span>
                      <span>Metrics</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                {validation.agent_analyses.map(agent => (
                  <TabsContent key={agent.id} value={agent.agent_type} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          {agent.agent_type === 'problem' && '🔍'}
                          {agent.agent_type === 'market' && '📊'}
                          {agent.agent_type === 'competitive' && '🏆'}
                          {agent.agent_type === 'uvp' && '⭐'}
                          {agent.agent_type === 'business_model' && '💼'}
                          {agent.agent_type === 'validation' && '✅'}
                          {agent.agent_type === 'legal' && '⚖️'}
                          {agent.agent_type === 'metrics' && '📈'}
                        </div>
                        <h3 className="text-lg font-semibold capitalize">{agent.agent_type.replace('_', ' ')} Analysis</h3>
                      </div>
                      <Badge className="px-3 py-1">{agent.score}/10</Badge>
                    </div>
                    
                    {/* Problem specific visual content */}
                    {agent.agent_type === 'problem' && (
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {agent.analysis.improved_problem_statement && (
                          <div className="rounded-lg border bg-blue-50 border-blue-200 p-4">
                            <h4 className="text-sm font-medium text-blue-700 mb-2">Improved Problem Statement</h4>
                            <div className="text-sm">{agent.analysis.improved_problem_statement}</div>
                          </div>
                        )}
                        
                        {agent.analysis.severity_index && (
                          <div className="rounded-lg border p-4">
                            <h4 className="text-sm font-medium mb-3">Problem Severity</h4>
                            <div className="space-y-2">
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-4 text-xs flex rounded-full bg-gray-200">
                                  <div 
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                      agent.analysis.severity_index >= 7 ? 'bg-red-500' : 
                                      agent.analysis.severity_index >= 5 ? 'bg-amber-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${(agent.analysis.severity_index/10) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Low</span>
                                  <span className="font-semibold">{agent.analysis.severity_index}/10</span>
                                  <span>High</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Root causes display with visual tags */}
                    {agent.agent_type === 'problem' && agent.analysis.root_causes && Array.isArray(agent.analysis.root_causes) && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Root Causes</h4>
                        <div className="flex flex-wrap gap-2">
                          {agent.analysis.root_causes.map((cause, i) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                              {cause}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Market specific visual content */}
                    {agent.agent_type === 'market' && agent.analysis.tam && agent.analysis.sam && agent.analysis.som && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Market Size Analysis</h4>
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[200px] h-[200px] rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="w-[140px] h-[140px] rounded-full bg-blue-200 flex items-center justify-center">
                                <div className="w-[80px] h-[80px] rounded-full bg-blue-300 flex items-center justify-center">
                                  <span className="text-xs font-semibold">SOM</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 w-full pt-[220px] text-center">
                            <div>
                              <div className="text-sm font-medium">TAM</div>
                              <div className="text-lg font-semibold">${agent.analysis.tam.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">SAM</div>
                              <div className="text-lg font-semibold">${agent.analysis.sam.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">SOM</div>
                              <div className="text-lg font-semibold">${agent.analysis.som.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Competition specific visual content */}
                    {agent.agent_type === 'competitive' && agent.analysis.competitors && Array.isArray(agent.analysis.competitors) && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Competitor Analysis</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Competitor
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Strengths
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Weaknesses
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {agent.analysis.competitors.map((competitor, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {competitor.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {Array.isArray(competitor.strengths) 
                                      ? (
                                        <div className="flex flex-wrap gap-1">
                                          {competitor.strengths.map((strength: string, i: number) => (
                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                              {strength}
                                            </span>
                                          ))}
                                        </div>
                                      ) 
                                      : competitor.strengths
                                    }
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {Array.isArray(competitor.weaknesses) 
                                      ? (
                                        <div className="flex flex-wrap gap-1">
                                          {competitor.weaknesses.map((weakness: string, i: number) => (
                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                              {weakness}
                                            </span>
                                          ))}
                                        </div>
                                      ) 
                                      : competitor.weaknesses
                                    }
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {/* Moat visualization - Only for competitive analysis */}
                    {agent.agent_type === 'competitive' && agent.analysis.moat_classification && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Competitive Moat Analysis</h4>
                        <div className="flex items-center justify-between bg-gray-100 rounded-full h-6 w-full px-3">
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                            agent.analysis.moat_classification === 'defensible' ? 'bg-green-500 text-white' : 'bg-gray-300'
                          }`}>
                            3
                          </div>
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                            agent.analysis.moat_classification === 'weak' ? 'bg-amber-500 text-white' : 'bg-gray-300'
                          }`}>
                            2
                          </div>
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                            agent.analysis.moat_classification === 'none' ? 'bg-red-500 text-white' : 'bg-gray-300'
                          }`}>
                            1
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                          <span>No Moat</span>
                          <span>Weak Moat</span>
                          <span>Defensible Moat</span>
                        </div>
                        <div className="mt-3 p-3 rounded-md bg-blue-50 border border-blue-200">
                          <div className="text-sm">
                            <span className="font-medium">Current status: </span>
                            <span className={
                              agent.analysis.moat_classification === 'defensible' ? 'text-green-600 font-medium' : 
                              agent.analysis.moat_classification === 'weak' ? 'text-amber-600 font-medium' : 
                              'text-red-600 font-medium'
                            }>
                              {agent.analysis.moat_classification === 'defensible' ? 'Defensible Moat' : 
                               agent.analysis.moat_classification === 'weak' ? 'Weak Moat' : 
                               'No Moat'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Business Model specific visual content */}
                    {agent.agent_type === 'business_model' && agent.analysis.pricing_tiers && Array.isArray(agent.analysis.pricing_tiers) && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Pricing Tiers</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {agent.analysis.pricing_tiers.map((tier: { name: string; price: string; features: string[] }, i: number) => (
                            <div key={i} className={`border rounded-lg p-4 ${i === 1 ? 'bg-blue-50 border-blue-200 shadow-sm' : ''}`}>
                              <div className="text-center mb-4">
                                <div className={`text-lg font-semibold mb-1 ${i === 1 ? 'text-blue-700' : ''}`}>{tier.name}</div>
                                <div className="text-2xl font-bold">{tier.price}</div>
                              </div>
                              <ul className="space-y-2">
                                {tier.features && Array.isArray(tier.features) && tier.features.map((feature: string, j: number) => (
                                  <li key={j} className="flex items-start text-sm">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Sustainability factors for Business Model */}
                    {agent.agent_type === 'business_model' && agent.analysis.sustainability_factors && Array.isArray(agent.analysis.sustainability_factors) && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Sustainability Factors</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {agent.analysis.sustainability_factors.map((factor: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 p-3 border rounded-md bg-green-50 border-green-200">
                              <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                {i + 1}
                              </div>
                              <div className="text-sm">{factor}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Monetization viability meter */}
                    {agent.agent_type === 'business_model' && agent.analysis.monetization_viability !== undefined && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Monetization Viability</h4>
                        <div className="p-4 border rounded-md">
                          <div className="relative pt-1">
                            <div className="relative h-4 overflow-hidden flex rounded-full bg-gray-200">
                              <div
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                  agent.analysis.monetization_viability >= 7 ? 'bg-green-500' : 
                                  agent.analysis.monetization_viability >= 4 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(agent.analysis.monetization_viability/10) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Low</span>
                              <span className="font-semibold">{agent.analysis.monetization_viability}/10</span>
                              <span>High</span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Interpretation: </span>
                            {agent.analysis.monetization_viability >= 7 ? (
                              <span className="text-green-600">Highly viable business model with strong monetization potential</span>
                            ) : agent.analysis.monetization_viability >= 4 ? (
                              <span className="text-amber-600">Moderate monetization potential with some challenges</span>
                            ) : (
                              <span className="text-red-600">Significant monetization challenges</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Default display for analysis content */}
                    <div className="space-y-4">
                      {Object.entries(agent.analysis).filter(([key]) => 
                        !['score', 'reasoning', 
                          // Problem fields with custom display
                          'improved_problem_statement', 'severity_index', 'root_causes', 
                          // Market fields with custom display
                          'tam', 'sam', 'som', 
                          // Competition fields with custom display
                          'competitors', 'moat_classification',
                          // Business model fields with custom display
                          'pricing_tiers', 'sustainability_factors', 'monetization_viability'
                        ].includes(key)
                      ).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <h4 className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</h4>
                          <div className="text-sm">
                            {typeof value === 'string' 
                              ? value
                              : Array.isArray(value)
                                ? value.map((item, i) => (
                                    <div key={i} className="mb-1">
                                      {typeof item === 'string' 
                                        ? item 
                                        : typeof item === 'object' && item !== null
                                          ? (
                                              <div className="border p-3 rounded-md mb-2">
                                                {Object.entries(item).map(([itemKey, itemValue]) => (
                                                  <div key={itemKey} className="mb-1">
                                                    <span className="font-medium capitalize">{itemKey.replace(/_/g, ' ')}: </span>
                                                    <span>
                                                      {typeof itemValue === 'string' 
                                                        ? itemValue
                                                        : Array.isArray(itemValue)
                                                          ? itemValue.join(', ')
                                                          : JSON.stringify(itemValue)}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            )
                                          : String(item)
                                      }
                                    </div>
                                  ))
                                : typeof value === 'object' && value !== null
                                  ? (
                                      <div>
                                        {Object.entries(value).map(([objKey, objValue]) => (
                                          <div key={objKey} className="mb-2">
                                            <div className="font-medium capitalize">{objKey.replace(/_/g, ' ')}:</div>
                                            <div className="pl-3">
                                              {typeof objValue === 'string' 
                                                ? objValue
                                                : Array.isArray(objValue)
                                                  ? objValue.map((item, i) => (
                                                      <div key={i} className="mb-1">
                                                        {typeof item === 'string' 
                                                          ? item 
                                                          : typeof item === 'object' && item !== null
                                                            ? (
                                                                <div className="border p-2 rounded-md my-1">
                                                                  {Object.entries(item).map(([itemKey, itemValue]) => (
                                                                    <div key={itemKey} className="mb-1">
                                                                      <span className="font-medium capitalize">{itemKey.replace(/_/g, ' ')}: </span>
                                                                      <span>
                                                                        {typeof itemValue === 'string' 
                                                                          ? itemValue
                                                                          : Array.isArray(itemValue)
                                                                            ? itemValue.join(', ')
                                                                            : JSON.stringify(itemValue)}
                                                                      </span>
                                                                    </div>
                                                                  ))}
                                                                </div>
                                                              )
                                                            : String(item)
                                                        }
                                                      </div>
                                                    ))
                                                  : typeof objValue === 'object' && objValue !== null
                                                    ? <pre className="text-xs whitespace-pre-wrap bg-muted/50 p-2 rounded-md mt-1">{JSON.stringify(objValue, null, 2)}</pre>
                                                    : String(objValue)
                                              }
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )
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