"use client"

import React from "react"
import { EnhancedValidationWithAnalysis } from "@/lib/supabase/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Printer } from "lucide-react"
import Link from "next/link"
import ReportHeader from "./sections/report-header"
import BusinessIdeaSection from "./sections/business-idea"
import ExecutiveSummary from "./sections/executive-summary"
import ProblemSection from "./sections/problem"
import TargetAudienceSection from "./sections/target-audience"
import MarketResearchSection from "./sections/market-research"
import CompetitiveAnalysisSection from "./sections/competitive-analysis"
import ValuePropositionSection from "./sections/value-proposition"
import BusinessModelSection from "./sections/business-model"
import CustomerValidationSection from "./sections/customer-validation"
import PricingStrategySection from "./sections/pricing-strategy"
import LegalComplianceSection from "./sections/legal-compliance"
import StrategicMetricsSection from "./sections/strategic-metrics"
import VCMethodologiesSection from "./sections/vc-methodologies"
import FinalRecommendationSection from "./sections/final-recommendation"
import ReportFooter from "./sections/report-footer"

// Mock data for development and testing purposes
const mockReportData = {
  // This is placeholder data for development
  business_type: "SaaS",
  overall_score: 82,
  feasibility: "✅ Buildable",
  investor_readiness: "🟡 Moderate",
  estimated_valuation: "$800K – $1.2M",
  
  user_input: "I want to build a platform where founders can get instant feedback on their startup ideas using AI.",
  ai_interpretation: "You're building a SaaS platform for early-stage startup founders to receive structured, investor-style scoring and feedback using AI.",
  
  summary_metrics: {
    overall_score: 82,
    feasibility: "✅ Buildable",
    time_to_mvp: "7–10 days",
    investor_readiness: "🟡 Moderate",
    pre_rev_valuation: "$800K – $1.2M"
  },
  frameworks_used: ["YC", "a16z", "Sequoia", "Scorecard"],
  
  // And so on with all other fields filled with reasonable default values
}

interface InvestorReportProps {
  validation: EnhancedValidationWithAnalysis
}

export default function InvestorReport({ validation }: InvestorReportProps) {
  // Add detailed console logging to see the exact data being received
  console.log("Validation object received:", {
    id: validation.id,
    analysis_id: validation.analysis?.id,
    has_report_data: validation.analysis && 'report_data' in validation.analysis,
  });
  
  if (validation.analysis && validation.analysis.report_data) {
    console.log("Report data structure:", {
      keys: Object.keys(validation.analysis.report_data),
      problem_keys: validation.analysis.report_data.problem ? Object.keys(validation.analysis.report_data.problem) : 'no problem field'
    });
  } else {
    console.log("No report_data found, will use legacy format");
  }
  
  // Use report_data if available, otherwise fallback to the legacy format
  let reportData = validation.analysis.report_data || generateLegacyReportData(validation);
  
  // Preprocess report data to ensure all required fields are present and properly formatted
  reportData = ensureReportDataStructure(reportData);
  
  // Extract the original business idea directly from the validation object
  const originalBusinessIdea = validation.business_idea;
  
  // Log detailed information about the business idea for debugging
  console.log("Business idea information:", {
    original_length: validation.business_idea?.length,
    report_data_length: reportData.user_input?.length,
    original_preview: validation.business_idea?.substring(0, 50),
    report_preview: reportData.user_input?.substring(0, 50),
    are_identical: validation.business_idea === reportData.user_input
  });
  
  // If the report_data.user_input is suspiciously shorter than the original, use the original
  if (reportData.user_input?.length < validation.business_idea?.length * 0.9) {
    console.log("Using original business idea instead of potentially truncated report data version");
    reportData.user_input = validation.business_idea;
  }
  
  // Log the final processed report data
  console.log("Final processed report data:", {
    business_type: reportData.business_type,
    overall_score: reportData.overall_score,
    problem_clarity: reportData.problem?.clarity_status,
    competition_moat: reportData.competition?.moat_status,
    user_input_length: reportData.user_input?.length,
    user_input_preview: reportData.user_input?.substring(0, 50)
  });
  
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
          <ReportHeader 
            businessType={reportData.business_type}
            overallScore={reportData.overall_score}
            feasibility={reportData.feasibility}
            investorReadiness={reportData.investor_readiness}
            estimatedValuation={reportData.estimated_valuation}
          />
          
          {/* Business Idea Section */}
          <BusinessIdeaSection 
            userInput={originalBusinessIdea || reportData.user_input}
            aiInterpretation={reportData.ai_interpretation}
          />
          
          {/* Executive Summary */}
          <ExecutiveSummary 
            metrics={reportData.summary_metrics}
            frameworks={reportData.frameworks_used}
          />
          
          {/* Main Content Sections */}
          <Tabs defaultValue="problem" className="w-full">
            <div className="border-b">
              <TabsList className="w-full justify-start bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="problem" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                >
                  Problem & Market
                </TabsTrigger>
                <TabsTrigger 
                  value="solution" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                >
                  Solution & Value
                </TabsTrigger>
                <TabsTrigger 
                  value="business" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                >
                  Business & Metrics
                </TabsTrigger>
                <TabsTrigger 
                  value="recommendation" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none py-3 px-4"
                >
                  Analysis & Next Steps
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Problem & Market Tab */}
            <TabsContent value="problem" className="space-y-8 mt-6">
              <ProblemSection problem={reportData.problem} />
              <TargetAudienceSection targetAudience={reportData.target_audience} />
              <MarketResearchSection market={reportData.market} />
              <CompetitiveAnalysisSection competition={reportData.competition} />
            </TabsContent>
            
            {/* Solution & Value Tab */}
            <TabsContent value="solution" className="space-y-8 mt-6">
              <ValuePropositionSection uvp={reportData.uvp} />
              <BusinessModelSection businessModel={reportData.business_model} />
              <CustomerValidationSection customerValidation={reportData.customer_validation} />
            </TabsContent>
            
            {/* Business & Metrics Tab */}
            <TabsContent value="business" className="space-y-8 mt-6">
              <PricingStrategySection pricing={reportData.pricing} />
              <LegalComplianceSection legal={reportData.legal} />
              <StrategicMetricsSection metrics={reportData.metrics} />
              <VCMethodologiesSection methodologies={reportData.vc_methodologies} />
            </TabsContent>
            
            {/* Analysis & Next Steps Tab */}
            <TabsContent value="recommendation" className="space-y-8 mt-6">
              <FinalRecommendationSection recommendation={reportData.recommendation} />
            </TabsContent>
          </Tabs>
          
          {/* Footer */}
          <ReportFooter id={validation.id} />
        </div>
      </div>
    </div>
  )
}

// Helper function to create a better AI interpretation of the business idea
function createAIInterpretation(validation: EnhancedValidationWithAnalysis): string {
  const businessIdea = validation.business_idea || '';
  const businessType = validation.business_type || "SaaS";
  const targetAudience = validation.target_audience || "specific market segment";
  
  // If the idea is short enough, use it directly
  if (businessIdea.length < 100) {
    return `Based on your description, you're building a ${businessType} solution that ${businessIdea}.`;
  }
  
  // Extract the first sentence or phrase for a more concise summary
  const firstSentence = businessIdea.split('.')[0];
  const shortenedIdea = firstSentence.length > 150 
    ? firstSentence.substring(0, 150) + '...' 
    : firstSentence;
  
  return `Based on your description, you're building a ${businessType} solution focused on ${targetAudience}. Your concept addresses ${shortenedIdea}. Our analysis evaluates market potential, business viability, and investor opportunities.`;
}

// Helper function to generate report data from the legacy validation format
function generateLegacyReportData(validation: EnhancedValidationWithAnalysis) {
  const { analysis } = validation
  
  // Ensure we have proper objects, not null
  const marketAnalysis = analysis.market_analysis || {}
  const businessModel = analysis.business_model || {}
  const teamStrength = analysis.team_strength || {}
  const overallAssessment = analysis.overall_assessment || {}
  
  // Ensure viability_score exists and is a number
  const viabilityScore = typeof overallAssessment.viability_score === 'number' 
    ? overallAssessment.viability_score 
    : 70 // Default score
  
  // Ensure strengths, weaknesses, and recommendations are arrays
  const strengths = Array.isArray(overallAssessment.strengths) 
    ? overallAssessment.strengths 
    : ['Strong business concept']
  
  const weaknesses = Array.isArray(overallAssessment.weaknesses) 
    ? overallAssessment.weaknesses 
    : ['Needs further validation']
  
  const recommendations = Array.isArray(overallAssessment.recommendations) 
    ? overallAssessment.recommendations 
    : ['Develop an MVP to test with actual users']
  
  // Create a simplified report data structure based on the legacy format
  return {
    business_type: validation.business_type || "Startup",
    overall_score: viabilityScore,
    feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
    investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
    estimated_valuation: "$500K – $1M", // Placeholder
    
    user_input: validation.business_idea, // Store the full business idea without truncation
    ai_interpretation: createAIInterpretation(validation),
    
    summary_metrics: {
      overall_score: viabilityScore,
      feasibility: viabilityScore > 70 ? "✅ Buildable" : "⚠️ Challenging",
      time_to_mvp: "4-8 weeks", // Placeholder
      investor_readiness: viabilityScore > 80 ? "🟢 High" : viabilityScore > 60 ? "🟡 Moderate" : "🔴 Low",
      pre_rev_valuation: "$500K – $1M" // Placeholder
    },
    frameworks_used: ["YC", "a16z", "Sequoia"], // Placeholder
    
    problem: {
      summary: "Problem identification based on business idea",
      clarity_status: viabilityScore > 75 ? "Clear" : "Needs Refinement",
      pain_severity: Math.floor(viabilityScore / 10),
      alternatives: ["Existing solutions"], // Placeholder
      ai_summary: marketAnalysis.target_audience || "The problem affects the target audience."
    },
    
    target_audience: {
      segments: [validation.target_audience || "Early adopters"],
      motivation: "Seeking solution to their problems", // Placeholder
      buyer_user_table: {
        buyer: "Decision maker",
        user: "End user"
      },
      persona_suggestions: ["Primary user persona"] // Placeholder
    },
    
    market: {
      tam: 0, // Placeholder
      sam: 0, // Placeholder
      som: 0, // Placeholder
      trends: [marketAnalysis.growth_potential || "Growing market"],
      why_now: "The timing is right due to market conditions" // Placeholder
    },
    
    competition: {
      competitors: [{
        name: "Competitor 1",
        strengths: "Established brand",
        weaknesses: "Higher pricing"
      }],
      moat_status: "Moderate",
      positioning: {
        x_axis: 7, // Customization
        y_axis: 6  // Trust
      }
    },
    
    uvp: {
      one_liner: validation.differentiation || "Unique value proposition",
      before_after: {
        before: "Before: Challenge faced",
        after: "After: Problem solved"
      },
      rating: Math.floor(viabilityScore / 10)
    },
    
    business_model: {
      pricing_tiers: [
        {
          name: "Free",
          price: "$0",
          features: ["Basic features"]
        },
        {
          name: "Pro",
          price: "$29/mo",
          features: ["Advanced features"]
        }
      ],
      revenue_estimation: "$10K-50K MRR in first year", // Placeholder
      upsell_suggestions: ["Enterprise tier", "Add-on services"]
    },
    
    customer_validation: {
      status: {
        landing_page: false,
        waitlist: false,
        interviews: false
      },
      best_quote: "From customer interviews", // Placeholder
      feedback_stats: {
        signups: 0,
        feedback_rate: 0
      }
    },
    
    pricing: {
      roi_match: 8, // 1-10 scale
      models: [validation.pricing_model || "Subscription"],
      suggestions: ["Consider tiered pricing"]
    },
    
    legal: {
      risks: ["Standard compliance requirements"],
      current_state: {
        "Terms of Service": false,
        "Privacy Policy": false
      },
      disclaimer_links: {
        "Terms": "#",
        "Privacy": "#"
      }
    },
    
    metrics: {
      success_rate: "75-80%",
      investment_score: 84,
      breakeven_point: "8 months",
      cac: validation.cac || "$25-40",
      ltv: validation.ltv || "$240",
      roi_year1: "3.2x",
      market_size_som: "$10M", // Placeholder
      scalability_index: 87,
      mvp_cost: "$1,800" // Placeholder
    },
    
    vc_methodologies: {
      "Y Combinator": "Team, traction",
      "a16z": "Moat, market fit",
      "Sequoia": "Market clarity"
    },
    
    recommendation: {
      summary: recommendations.join(" ") || "Based on our analysis, we recommend proceeding with caution.",
      next_steps: [
        {
          task: "Launch MVP",
          completed: false
        },
        {
          task: "Run user interviews",
          completed: false
        },
        {
          task: "Prepare pitch for investors",
          completed: false
        }
      ]
    },
    
    created_at: validation.created_at,
    updated_at: validation.updated_at
  }
}

function ensureReportDataStructure(reportData: any) {
  // Clone the report data to avoid modifying the original object
  const processedData = JSON.parse(JSON.stringify(reportData));
  
  // Ensure user_input exists and is properly formatted
  if (!processedData.user_input) {
    console.warn("Missing user_input in report data");
    processedData.user_input = "";
  } else if (typeof processedData.user_input !== 'string') {
    // Fix for cases where user_input might be incorrectly serialized or malformed
    console.warn("user_input is not a string, converting", typeof processedData.user_input);
    try {
      processedData.user_input = String(processedData.user_input);
    } catch (e) {
      console.error("Failed to convert user_input to string", e);
      processedData.user_input = "";
    }
  }
  
  // Check if user_input is suspiciously short (might be truncated)
  if (processedData.user_input && processedData.user_input.length < 100 && 
      processedData.user_input.endsWith('...')) {
    console.warn("user_input appears to be truncated:", processedData.user_input);
  }
  
  // Ensure ai_interpretation exists
  if (!processedData.ai_interpretation) {
    processedData.ai_interpretation = `Based on your description, we've analyzed your business idea to provide a comprehensive evaluation.`;
  }
  
  // Ensure problem structure
  if (!processedData.problem) {
    processedData.problem = {};
  }
  
  // Ensure problem.clarity_status is one of the expected values with proper casing
  if (processedData.problem.clarity_status) {
    const clarityStatus = processedData.problem.clarity_status.toString().toLowerCase();
    if (clarityStatus === 'clear' || clarityStatus === 'clarity_status' || clarityStatus === 'identified') {
      processedData.problem.clarity_status = 'Clear';
    } else if (clarityStatus === 'vague' || clarityStatus === 'needs refinement') {
      processedData.problem.clarity_status = 'Vague';
    } else {
      processedData.problem.clarity_status = 'Not identified';
    }
  } else {
    processedData.problem.clarity_status = 'Vague';
  }
  
  // Ensure problem.pain_severity is a number between 1 and 10
  if (!processedData.problem.pain_severity || 
      typeof processedData.problem.pain_severity !== 'number' ||
      processedData.problem.pain_severity < 1 ||
      processedData.problem.pain_severity > 10) {
    processedData.problem.pain_severity = 7;
  }
  
  // Ensure problem.alternatives is an array
  if (!Array.isArray(processedData.problem.alternatives)) {
    processedData.problem.alternatives = ["Existing solutions", "Manual processes"];
  }
  
  // Ensure competition structure
  if (!processedData.competition) {
    processedData.competition = {};
  }
  
  // Ensure competition.moat_status is one of the expected values with proper casing
  if (processedData.competition.moat_status) {
    const moatStatus = processedData.competition.moat_status.toString().toLowerCase();
    if (moatStatus === 'strong') {
      processedData.competition.moat_status = 'Strong';
    } else if (moatStatus === 'weak') {
      processedData.competition.moat_status = 'Weak';
    } else {
      processedData.competition.moat_status = 'Moderate';
    }
  } else {
    processedData.competition.moat_status = 'Moderate';
  }
  
  // Ensure competition.competitors is an array
  if (!Array.isArray(processedData.competition.competitors) || processedData.competition.competitors.length === 0) {
    processedData.competition.competitors = [{
      name: "Competitor 1",
      strengths: "Established brand",
      weaknesses: "Higher pricing",
      price: "$100-500/mo"
    }];
  }
  
  // Ensure competition.positioning has x_axis and y_axis
  if (!processedData.competition.positioning || 
      typeof processedData.competition.positioning !== 'object') {
    processedData.competition.positioning = { x_axis: 7, y_axis: 6 };
  } else {
    if (typeof processedData.competition.positioning.x_axis !== 'number') {
      processedData.competition.positioning.x_axis = 7;
    }
    if (typeof processedData.competition.positioning.y_axis !== 'number') {
      processedData.competition.positioning.y_axis = 6;
    }
  }
  
  // Make sure other required sections are present
  const requiredSections = [
    'target_audience', 'market', 'uvp', 'business_model', 
    'customer_validation', 'pricing', 'legal', 'metrics', 
    'vc_methodologies', 'recommendation', 'summary_metrics'
  ];
  
  requiredSections.forEach(section => {
    if (!processedData[section]) {
      processedData[section] = {};
    }
  });
  
  // Ensure frameworks_used is an array
  if (!Array.isArray(processedData.frameworks_used)) {
    processedData.frameworks_used = ["YC", "a16z", "Sequoia"];
  }
  
  return processedData;
} 