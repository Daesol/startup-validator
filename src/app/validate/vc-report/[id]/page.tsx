"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import type { VCValidationWithAnalyses, VCAgentType } from "@/lib/supabase/types"
import { Card } from "@/components/ui/card"
import { Loader2, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { VCReport } from "@/components/vc-report"
import { getVCValidationWithAnalyses } from "@/lib/supabase/vc-validation-service"

export default function VCReportPage() {
  const params = useParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [validation, setValidation] = useState<VCValidationWithAnalyses | null>(null)
  const [processingAnalysis, setProcessingAnalysis] = useState(true) // Start with processing state
  const [processingProgress, setProcessingProgress] = useState(10) // Start with 10% progress
  const [processingStage, setProcessingStage] = useState<string>("Initializing analysis")
  const [completedStages, setCompletedStages] = useState<string[]>([])
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 120 // Increase to handle longer processing times (up to 10 minutes)
  const previousAgentCount = useRef<number>(0)
  const lastActivityTime = useRef<number>(Date.now())
  const lastAgentCount = useRef<number>(0)

  // Stages of processing
  const stages = {
    initializing: "Initializing analysis",
    problem: "Problem analysis in progress",
    market: "Market analysis in progress",
    competitive: "Competitive analysis in progress",
    uvp: "UVP analysis in progress",
    business_model: "Business model analysis in progress",
    validation: "Validation analysis in progress",
    legal: "Legal analysis in progress",
    metrics: "Metrics analysis in progress",
    vc_lead: "VC lead synthesis in progress",
    finalizing: "Finalizing report"
  };

  // Update UI based on validation state
  const updateUIFromValidation = (vcData: VCValidationWithAnalyses | null) => {
    if (!vcData) return;
    
    try {
      // Extract agent types and count
      const agentAnalyses = vcData.agent_analyses || [];
      const completedAgentTypes = agentAnalyses.map(a => a.agent_type);
      const currentAgentCount = agentAnalyses.length;
      
      // Calculate progress based on agent count and status
      if (currentAgentCount !== previousAgentCount.current) {
        // Agent count has changed, update progress more significantly
        const progressPerAgent = 80 / 8; // 8 agents in total, leave 20% for final processing
        const newProgress = 10 + (currentAgentCount * progressPerAgent);
        setProcessingProgress(Math.min(90, newProgress));
        previousAgentCount.current = currentAgentCount;
        
        console.log(`Agent progress updated: ${currentAgentCount} agents, progress: ${Math.min(90, newProgress)}%`);
      }

      // Update completed stages
      setCompletedStages(prev => {
        const newStages = [...prev];
        
        if (completedAgentTypes.includes('problem') && !prev.includes("Problem analysis complete")) {
          newStages.push("Problem analysis complete");
        }
        
        if (completedAgentTypes.includes('market') && !prev.includes("Market analysis complete")) {
          newStages.push("Market analysis complete");
        }
        
        if (completedAgentTypes.includes('competitive') && !prev.includes("Competitive analysis complete")) {
          newStages.push("Competitive analysis complete");
        }
        
        if (completedAgentTypes.includes('uvp') && !prev.includes("UVP analysis complete")) {
          newStages.push("UVP analysis complete");
        }
        
        if (completedAgentTypes.includes('business_model') && !prev.includes("Business model analysis complete")) {
          newStages.push("Business model analysis complete");
        }
        
        if (completedAgentTypes.includes('validation') && !prev.includes("Validation analysis complete")) {
          newStages.push("Validation analysis complete");
        }
        
        if (completedAgentTypes.includes('legal') && !prev.includes("Legal analysis complete")) {
          newStages.push("Legal analysis complete");
        }
        
        if (completedAgentTypes.includes('metrics') && !prev.includes("Metrics analysis complete")) {
          newStages.push("Metrics analysis complete");
        }
        
        return newStages;
      });
      
      // Set current stage based on completed agent analyses
      if (currentAgentCount === 0) {
        setProcessingStage(stages.initializing);
      } else if (currentAgentCount === 1) {
        setProcessingStage(stages.market);
      } else if (currentAgentCount === 2) {
        setProcessingStage(stages.competitive);
      } else if (currentAgentCount === 3) {
        setProcessingStage(stages.uvp);
      } else if (currentAgentCount === 4) {
        setProcessingStage(stages.business_model);
      } else if (currentAgentCount === 5) {
        setProcessingStage(stages.validation);
      } else if (currentAgentCount === 6) {
        setProcessingStage(stages.legal);
      } else if (currentAgentCount === 7) {
        setProcessingStage(stages.metrics);
      } else if (currentAgentCount === 8) {
        setProcessingStage(stages.vc_lead);
      }
      
      // Handle completion - only transition to report when BOTH:
      // 1. Status is "completed" 
      // 2. We have all 8 agent analyses
      // 3. The report data exists and has meaningful content
      const requiredAgentTypes = ['problem', 'market', 'competitive', 'uvp', 'business_model', 'validation', 'legal', 'metrics'] as VCAgentType[];
      const allRequiredAgentsComplete = requiredAgentTypes.every(type => completedAgentTypes.includes(type));
      const hasValidReport = vcData.validation.vc_report && 
                            Object.keys(vcData.validation.vc_report).length > 0 && 
                            vcData.validation.vc_report.overall_score !== undefined;
      
      const isComplete = vcData.validation.status === "completed" && allRequiredAgentsComplete && hasValidReport;
      const hasAllAgents = currentAgentCount >= 8;
                            
      console.log(`Validation check: status=${vcData.validation.status}, agents=${currentAgentCount}/8, allRequired=${allRequiredAgentsComplete}, hasReport=${hasValidReport}, isComplete=${isComplete}`);
      
      // Final completion logic with fallbacks
      if (isComplete) {
        // Perfect case - everything completed properly
        setProcessingStage("Report generation complete");
        setProcessingProgress(100);
        setCompletedStages(prev => {
          if (!prev.includes("Report generation complete")) {
            return [...prev, "Report generation complete"];
          }
          return prev;
        });
        
        // Show the report after a short delay to show the completed state
        setTimeout(() => {
          setProcessingAnalysis(false);
          setValidation(vcData);
          console.log("Transition to report view - validation complete");
        }, 1500); // Short delay to show completion state
      } else if (vcData.validation.status === "completed" && hasAllAgents) {
        // Status is completed and we have all agents, but report might be incomplete
        // This is a fallback to handle cases where the report is missing components
        console.log("Status is complete and all agents present. Showing report with potential limitations.");
        
        setProcessingStage("Report generation complete");
        setProcessingProgress(100);
        
        setTimeout(() => {
          setProcessingAnalysis(false);
          setValidation(vcData);
          console.log("Transition to report view - fallback with all agents");
        }, 1500);
      } else if (vcData.validation.status === "completed" && !hasValidReport) {
        // Status is completed but report is missing or incomplete
        console.log("Status is completed but report is missing or incomplete. Keeping loading screen.");
      }
    } catch (error) {
      console.error("Error in updateUIFromValidation:", error);
      // Don't crash the component on errors in the UI update logic
    }
  };

  // Fetch validation with progressive backoff
  const fetchValidationData = useCallback(async () => {
    try {
      console.log(`Fetching validation data, attempt #${retryCount + 1}`);
      
      const result = await getVCValidationWithAnalyses(params.id as string);
      
      if (!result.success || !result.data) {
        if (retryCount < maxRetries) {
          // Progressive backoff with a cap
          const delay = Math.min(3000 + Math.floor(retryCount / 10) * 1000, 10000);
          console.log(`No validation data yet, retrying in ${delay/1000}s...`);
          
          // On the first few attempts, try to clear any cached data to ensure fresh results
          if (retryCount < 3) {
            console.log("Clearing cached validation data");
            setValidation(null);
          }
          
          setTimeout(() => setRetryCount(r => r + 1), delay);
          return null;
        } else {
          throw new Error(result.error || "Failed to fetch validation data after multiple attempts");
        }
      }
      
      // Log validation state
      const vcData = result.data;
      const agentCount = vcData.agent_analyses?.length || 0;
      const status = vcData.validation.status;
      const hasReport = vcData.validation.vc_report && Object.keys(vcData.validation.vc_report).length > 0;
      
      console.log(`Validation data: status=${status}, agents=${agentCount}, hasReport=${hasReport}, id=${vcData.validation.id}, formId=${vcData.form.id}`);
      
      // Add detailed diagnostics for failed validations
      if (status === "failed") {
        console.info("Validation failed diagnostics:", {
          formId: vcData.form.id,
          validationId: vcData.validation.id,
          createdAt: vcData.validation.created_at,
          updatedAt: vcData.validation.updated_at,
          businessIdeaLength: vcData.form.business_idea?.length || 0,
          reportFields: vcData.validation.vc_report ? Object.keys(vcData.validation.vc_report) : [],
          agentTypesCompleted: vcData.agent_analyses.map(a => a.agent_type)
        });
      }
      
      // Track activity and progress
      const now = Date.now();
      if (agentCount > lastAgentCount.current) {
        // New agent data detected - update activity timestamp
        lastActivityTime.current = now;
        lastAgentCount.current = agentCount;
        console.log("New agent data detected, reset activity timer");
      }
      
      // Calculate inactivity time in seconds
      const inactivityTime = (now - lastActivityTime.current) / 1000;
      console.log(`Processing in progress (${status}), checking again in 3s... (Inactive: ${Math.floor(inactivityTime)}s)`);
      
      // Update UI based on validation state
      updateUIFromValidation(vcData);
      
      // Store validation data for reference, but don't show report until it's ready
      if (validation === null && vcData.validation.vc_report) {
        setValidation(vcData);
      }
      
      // Determine if processing is complete
      const requiredAgentTypes = ['problem', 'market', 'competitive', 'uvp', 'business_model', 'validation', 'legal', 'metrics'] as VCAgentType[];
      const completedAgentTypes = vcData.agent_analyses.map(a => a.agent_type);
      const allRequiredAgentsComplete = requiredAgentTypes.every(type => completedAgentTypes.includes(type));
      const hasValidReport = vcData.validation.vc_report && 
                            Object.keys(vcData.validation.vc_report).length > 0 &&
                            vcData.validation.vc_report.overall_score !== undefined;
      
      // Various completion states
      const isComplete = status === "completed" && allRequiredAgentsComplete && hasValidReport;
      const isFailed = status === "failed";
      const isStalled = inactivityTime > 60 && agentCount > 0 && agentCount < 8; // No new agents for 60 seconds
      
      if (isFailed) {
        // Instead of throwing an error, set the error state and return the data we have
        console.warn("[Handled] Validation status is 'failed' - showing error UI with recovery options");
        setError("Validation analysis failed. This could be due to a processing issue or complexity in analyzing your business idea.");
        
        // If we have some agent analyses, we can still show partial results
        if (agentCount >= 4) {
          // After displaying the error, allow viewing partial results
          setTimeout(() => {
            setProcessingAnalysis(false);
          }, 1500);
        }
        
        return vcData;
      }
      
      // Auto-refresh if analysis appears stalled but has made progress
      if (isStalled && agentCount >= 4) {
        console.log(`Analysis appears stalled (${Math.round(inactivityTime)}s inactive). Auto-refreshing...`);
        setProcessingStage(`${processingStage} - refreshing data...`);
        
        // Avoid excessive refreshes
        lastActivityTime.current = now; // Reset activity timer
        
        // Force a page refresh to get the latest data
        if (typeof window !== 'undefined') {
          window.location.reload();
          return vcData;
        }
      }
      
      if (!isComplete && retryCount < maxRetries) {
        // Adaptive polling interval based on activity and agent count
        let delay: number;
        
        if (agentCount > 0) {
          // If we have agents, poll based on how recently we've seen activity
          if (inactivityTime < 15) {
            // Recent activity - poll frequently
            delay = 3000;
          } else if (inactivityTime < 30) {
            // Less recent activity - slow down a bit
            delay = 5000;
          } else {
            // No activity for a while - slow down more
            delay = 8000;
          }
        } else {
          // No agents yet - use progressive backoff
          delay = Math.min(3000 + Math.floor(retryCount / 10) * 1000, 10000);
        }
        
        console.log(`Processing in progress (${status}), checking again in ${delay/1000}s... (Inactive: ${Math.round(inactivityTime)}s)`);
        setTimeout(() => setRetryCount(r => r + 1), delay);
        return vcData;
      }
      
      if (isComplete) {
        console.log("Processing complete, report is ready");
        // updateUIFromValidation will handle showing the report after a short delay
        return vcData;
      }
      
      if (retryCount >= maxRetries) {
        // If we've reached max retries but have a valid response, return it anyway
        console.log("Max retries reached, returning current state");
        
        // If we have most agent data but never completed, show it anyway
        if (agentCount >= 6) {
          console.log("Showing partial results - most agents completed");
          setProcessingAnalysis(false);
        } else if (agentCount > 0) {
          // Force a page refresh as a last resort if we have some data
          console.log("Analysis didn't complete within expected time. Refreshing page...");
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }
        
        return vcData;
      }
      
      return vcData;
    } catch (error) {
      console.error("Error fetching validation:", error);
      setError(error instanceof Error ? error.message : "Failed to load validation data");
      return null;
    }
  }, [params.id, retryCount, maxRetries]);

  // Initial data fetch on mount and when retryCount changes
  useEffect(() => {
    if (params.id) {
      // Clear any cached data when the ID changes
      if (validation && validation.form.id !== params.id && validation.validation.id !== params.id) {
        console.log("ID changed, clearing cached validation data");
        setValidation(null);
        setProcessingAnalysis(true);
        setProcessingProgress(10);
        setCompletedStages([]);
        previousAgentCount.current = 0;
        lastActivityTime.current = Date.now();
      }
      fetchValidationData();
    }
  }, [params.id, retryCount, fetchValidationData]);

  // Additional polling effect to ensure we get updates even if the backend is slow
  useEffect(() => {
    // Only set up polling if we're still processing
    if (!processingAnalysis || !params.id) return;
    
    let intervalId: NodeJS.Timeout;
    
    // Start polling after a short delay
    const timeoutId = setTimeout(() => {
      // Poll more frequently at first, then slow down
      const pollInterval = previousAgentCount.current === 0 ? 5000 : 10000;
      
      console.log(`Setting up background polling every ${pollInterval/1000}s`);
      intervalId = setInterval(() => {
        const now = Date.now();
        const timeSinceLastUpdate = (now - lastActivityTime.current) / 1000;
        
        // Only trigger a refresh if we haven't seen activity in a while
        if (timeSinceLastUpdate > 15) {
          console.log(`No updates in ${Math.floor(timeSinceLastUpdate)}s, polling for updates...`);
          fetchValidationData();
        }
      }, pollInterval);
    }, 15000); // Start polling after 15s
    
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [processingAnalysis, params.id, fetchValidationData]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    console.log("Manual refresh requested");
    setError(null);
    setRetryCount(0);
    setProcessingProgress(10);
    setProcessingAnalysis(true);
    setCompletedStages([]);
    setProcessingStage("Initializing analysis");
    lastActivityTime.current = Date.now();
    previousAgentCount.current = 0;
    router.refresh();
    // Restart validation check
    fetchValidationData();
  }, [router]);

  // Show processing UI during analysis
  if (processingAnalysis) {
    // Calculate time since last refresh in seconds
    const timeSinceLastAgentUpdate = Math.floor((Date.now() - lastActivityTime.current) / 1000);
    const hasActiveAgents = previousAgentCount.current > 0;
    const inactiveForLongTime = timeSinceLastAgentUpdate > 30;
    const agentCount = previousAgentCount.current;
    
    // Tips to show during processing
    const tips = [
      "AI agents are working together to evaluate different aspects of your business.",
      "Each agent specializes in a different area like market analysis or business model validation.",
      "Your analysis typically involves 8 specialized AI agents working together.",
      "The process usually takes 60-90 seconds to complete.",
      "Results will include strengths, weaknesses, and suggested improvements.",
    ];
    
    // Select a random tip, but change it every 10 seconds
    const tipIndex = Math.floor(retryCount / 3) % tips.length;
    
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="p-8 max-w-2xl w-full">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              {agentCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {agentCount}/8
                </div>
              )}
            </div>
            
            <div className="space-y-2 w-full">
              <h2 className="text-2xl font-semibold">Multi-Agent Analysis in Progress</h2>
              <p className="text-muted-foreground">
                {tips[tipIndex]}
              </p>
              <div className="w-full mt-6 space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{processingProgress < 100 ? 'Processing...' : 'Completed!'}</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2.5 w-full" />
                <p className="text-sm font-medium mt-2">
                  {processingStage}
                </p>
                {hasActiveAgents && inactiveForLongTime && (
                  <p className="text-xs text-amber-600 mt-1">
                    No updates for {timeSinceLastAgentUpdate}s. Analysis may be taking longer than usual.
                  </p>
                )}
              </div>
              
              {/* Show completed stages with animations */}
              <div className="mt-6 text-left border rounded-md p-4 max-h-48 overflow-y-auto bg-muted/20">
                <h3 className="text-sm font-semibold mb-2">Progress:</h3>
                <ul className="space-y-2 text-sm">
                  {completedStages.map((stage, index) => (
                    <li key={index} className="flex items-center animate-fadeIn">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span>{stage}</span>
                    </li>
                  ))}
                  {completedStages.length === 0 && (
                    <li className="text-muted-foreground">Starting analysis...</li>
                  )}
                </ul>
              </div>
            </div>
            
            {(retryCount >= maxRetries / 2 || (hasActiveAgents && inactiveForLongTime)) && (
              <div className="pt-4">
                <Button 
                  onClick={handleRefresh} 
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh Analysis</span>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {hasActiveAgents 
                    ? "Analysis appears paused. Click to refresh the page and check progress."
                    : "If you've waited more than a minute, click to refresh."}
                </p>
              </div>
            )}
            
            {hasActiveAgents && inactiveForLongTime && previousAgentCount.current >= 6 && (
              <div className="pt-2">
                <Button 
                  onClick={() => setProcessingAnalysis(false)} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <span>View Partial Results</span>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Most analyses are complete. View results without waiting for completion.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Show error UI
  if (error) {
    // Determine if we have partial results to display
    const hasPartialResults = validation && validation.agent_analyses && validation.agent_analyses.length >= 4;
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md w-full">
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Analysis Encountered an Issue</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-sm text-gray-700">
              This sometimes happens with complex business ideas or when our AI agents encounter unexpected data patterns.
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Troubleshooting tips:</h3>
            <ul className="text-sm text-muted-foreground pl-5 list-disc space-y-1">
              <li>Try shortening your business description to focus on core elements</li>
              <li>Ensure your description has clear problem and solution statements</li>
              <li>Consider breaking complex ideas into simpler components</li>
              <li>Use the basic validation if you continue having issues</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            {hasPartialResults && (
              <Button 
                onClick={() => setProcessingAnalysis(false)} 
                className="flex items-center gap-2"
              >
                <span>View Partial Results</span>
              </Button>
            )}
            
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Analysis Again</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => router.push('/validate/general')}
            >
              <span>Try Basic Validation Instead</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => router.push('/validate')}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show not found UI
  if (!validation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Not Found</h2>
          <p>No validation data found for this request.</p>
          <Button 
            onClick={handleRefresh} 
            className="mt-4 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </Card>
      </div>
    );
  }

  // Show report UI
  console.log("Rendering VC report with validation data");
  return <VCReport validation={validation} />;
} 