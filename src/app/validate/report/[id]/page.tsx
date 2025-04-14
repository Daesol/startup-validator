"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import type { ValidationWithAnalysis, EnhancedValidationWithAnalysis } from "@/lib/supabase/types"
import { Card } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { LoadingPage, completeLoadingProgress } from "@/features/validation/components/loading-page"
import InvestorReport from "@/components/investor-report"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Helper function to check if an analysis has valid data
function isValidAnalysis(analysisData: any): boolean {
  // We just need to make sure we have an analysis record, even if empty
  // Our InvestorReport component can handle missing data with fallbacks
  console.log("Analysis data to validate:", analysisData);
  console.log("Has report_data:", analysisData && analysisData.report_data ? "Yes" : "No");
  return !!analysisData && typeof analysisData === 'object';
}

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validation, setValidation] = useState<EnhancedValidationWithAnalysis | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [processingAnalysis, setProcessingAnalysis] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const maxRetries = 12 // Increased from 5 to 12 (24 seconds total)

  // Add debug info
  console.log("Current params:", params);
  console.log("Current retry count:", retryCount);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Simulate progress while waiting for analysis to complete
    if (processingAnalysis) {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          // Keep progress under 95% until we actually get results
          return prev < 94 ? prev + 1 : prev
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [processingAnalysis])

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        console.log("Fetching analysis, attempt #", retryCount + 1);
        
        // First, get the validation form
        const { data: formData, error: formError } = await supabase
          .from("validation_forms")
          .select("*")
          .eq("id", params.id)
          .single()

        if (formError) {
          console.error("Form data error:", formError);
          throw new Error(`Failed to fetch form data: ${formError.message}`)
        }

        if (!formData) {
          console.error("No form data found");
          throw new Error("No form data found")
        }

        console.log("Form data retrieved successfully:", formData.id);

        // Then, get the analysis with retry logic for when it's still processing
        const { data: analysisData, error: analysisError } = await supabase
          .from("validation_analyses")
          .select("*")
          .eq("validation_form_id", params.id)
          .maybeSingle()  // Use maybeSingle() instead of single() to avoid error when no rows returned

        if (analysisError && analysisError.code !== 'PGRST116') {
          // PGRST116 is the "no rows returned" error which we want to handle
          console.error("Analysis error:", analysisError);
          throw new Error(`Failed to fetch analysis: ${analysisError.message}`)
        }

        console.log("Analysis data retrieved:", analysisData ? "Yes" : "No");
        
        // Check if we have a valid analysis with actual data
        const validAnalysisFound = analysisData && isValidAnalysis(analysisData);
        console.log("Valid analysis found:", validAnalysisFound);
        
        if (!validAnalysisFound) {
          // Analysis might still be processing, retry after a delay
          if (retryCount < maxRetries) {
            console.log("Will retry in 2 seconds...");
            setProcessingAnalysis(true)
            setTimeout(() => {
              setRetryCount(prev => prev + 1)
            }, 2000)  // Retry after 2 seconds
            return
          }
          // Instead of throwing an error, we'll set a processing state
          console.log("Max retries reached, showing processing state");
          setProcessingAnalysis(true)
          return
        }

        // Finally, get the team members
        const { data: teamData, error: teamError } = await supabase
          .from("team_members")
          .select("*")
          .eq("validation_form_id", params.id)

        if (teamError) {
          console.warn("Failed to fetch team members:", teamError)
          // Continue without team members
        }

        console.log("Team members retrieved:", teamData ? teamData.length : 0);

        // Combine all the data
        const validationData = {
          ...formData,
          analysis: analysisData,
          team_members: teamData || [],
        };
        
        console.log("Combined validation data:", {
          id: validationData.id,
          has_analysis: !!validationData.analysis,
          has_report_data: validationData.analysis && !!validationData.analysis.report_data,
          team_members: validationData.team_members.length
        });
        
        setValidation(validationData);

        // Complete the loading animation
        completeLoadingProgress()
        setProcessingAnalysis(false)
        setProcessingProgress(100)
      } catch (error) {
        console.error("Error fetching analysis:", error)
        setError(error instanceof Error ? error.message : "Failed to load analysis. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAnalysis()
    }
  }, [params.id, supabase, retryCount])

  const handleRefresh = () => {
    setRetryCount(0)
    setProcessingProgress(30) // Reset progress but not to 0 to show some progress immediately
    setLoading(true)
  }

  if (loading) {
    return <LoadingPage onComplete={() => router.push(`/validate/report/${params.id}`)} />
  }

  if (processingAnalysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-lg w-full">
          <div className="flex flex-col items-center text-center space-y-6">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <div className="space-y-2 w-full">
              <h2 className="text-xl font-semibold">Analyzing Your Startup Idea</h2>
              <p className="text-muted-foreground">
                Our AI is performing a comprehensive evaluation of your business concept. 
                This typically takes 20-40 seconds.
              </p>
              <div className="w-full mt-6 space-y-2">
                <Progress value={processingProgress} className="h-2 w-full" />
                <p className="text-sm text-muted-foreground">
                  {processingProgress < 100 ? "Processing..." : "Analysis complete!"}
                </p>
              </div>
            </div>
            
            {retryCount >= maxRetries && (
              <div className="pt-4">
                <Button 
                  onClick={handleRefresh} 
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Analysis</span>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  If you've waited more than a minute, click to refresh.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={handleRefresh} 
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </Card>
      </div>
    )
  }

  if (!validation || !validation.analysis) {
    console.log("No validation or analysis data to render");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Not Found</h2>
          <p>No analysis found for this validation.</p>
          <Button 
            onClick={handleRefresh} 
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </Card>
      </div>
    )
  }

  console.log("Rendering investor report with validation data");
  return <InvestorReport validation={validation} />
} 