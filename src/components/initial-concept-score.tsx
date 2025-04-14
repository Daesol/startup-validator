import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Check, Loader2, Wrench, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface InitialConceptScoreProps {
  businessIdea: string;
  onImprovedIdeaSubmit: (improvedIdea: string) => void;
  onProceedWithOriginal: () => void;
}

export function InitialConceptScore({
  businessIdea,
  onImprovedIdeaSubmit,
  onProceedWithOriginal,
}: InitialConceptScoreProps) {
  const [score, setScore] = useState<number | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [improvedIdea, setImprovedIdea] = useState<string>(businessIdea);
  const [loading, setLoading] = useState(true);
  const [improving, setImproving] = useState(false);
  const router = useRouter();

  // Simulate the AI scoring analysis (replace with actual API call)
  React.useEffect(() => {
    const analyzeIdea = async () => {
      try {
        setLoading(true);
        
        // Call the analyze-idea API endpoint
        const response = await fetch('/api/analyze-idea', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ businessIdea }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to analyze idea');
        }
        
        const data = await response.json();
        setScore(data.score);
        setReasoning(data.reasoning);
      } catch (error) {
        console.error("Error analyzing idea:", error);
        setScore(5); // Default fallback score
        setReasoning("We encountered an error analyzing your idea. Consider adding more details.");
      } finally {
        setLoading(false);
      }
    };
    
    analyzeIdea();
  }, [businessIdea]);

  const handleImproveIdea = async () => {
    try {
      setImproving(true);
      
      // Call the improve-idea API endpoint
      const response = await fetch('/api/improve-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessIdea }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to improve idea');
      }
      
      const data = await response.json();
      setImprovedIdea(data.improvedIdea);
    } catch (error) {
      console.error("Error improving idea:", error);
    } finally {
      setImproving(false);
    }
  };

  const handleUseImprovedIdea = () => {
    onImprovedIdeaSubmit(improvedIdea);
  };

  // Render loading state
  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Analyzing Your Business Idea</CardTitle>
          <CardDescription>
            Step 1 of 2: Checking the quality of your business concept before proceeding to full validation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-center text-muted-foreground">
            Evaluating clarity, target market, and overall concept quality...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Render results when score is available
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          Initial Concept Quality Check
          {score !== null && score >= 7 ? (
            <span className="text-green-500 bg-green-50 px-2 py-1 rounded-full text-sm">
              <Check className="inline-block w-4 h-4 mr-1" />
              Passed
            </span>
          ) : (
            <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-sm">
              <AlertCircle className="inline-block w-4 h-4 mr-1" />
              Needs Improvement
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Step 1 of 2: Quality assessment before generating your full validation report.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Concept Quality</span>
            <span className="font-medium">{score}/10</span>
          </div>
          <Progress value={score !== null ? score * 10 : 0} className="h-2" />
        </div>

        {score !== null && score < 7 && reasoning && (
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <h3 className="font-medium text-amber-800 mb-2">Improvement Recommended</h3>
            <p className="text-amber-700 text-sm">{reasoning}</p>
          </div>
        )}

        {score !== null && score >= 7 && (
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <h3 className="font-medium text-green-800 mb-2">
              ✅ Your idea is ready for full validation
            </h3>
            <p className="text-green-700 text-sm">
              Your business concept shows good potential. You can now proceed to generate a full validation report.
            </p>
          </div>
        )}

        {score !== null && score < 7 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Business Idea</label>
              <Textarea 
                value={improvedIdea}
                onChange={(e) => setImprovedIdea(e.target.value)}
                className="min-h-[150px] whitespace-pre-wrap font-mono text-sm"
              />
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end">
        {score !== null && score < 7 && (
          <>
            <Button 
              variant="outline" 
              onClick={handleImproveIdea}
              disabled={improving}
              className="w-full sm:w-auto"
            >
              {improving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Wrench className="mr-2 h-4 w-4" />
                  Improve with Validator AI
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleUseImprovedIdea}
              className="w-full sm:w-auto"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue with Improved Idea
            </Button>
          </>
        )}
        
        {score !== null && score >= 7 && (
          <Button 
            onClick={onProceedWithOriginal}
            className="w-full sm:w-auto"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Continue to Full Validation
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Mock functions to simulate AI calls - replace with actual API integrations
async function simulateAIAnalysis(idea: string): Promise<{ score: number; reasoning: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Basic scoring logic based on text length and keywords
  const words = idea.trim().split(/\s+/).length;
  const hasTargetAudience = /target|audience|customer|user|market|segment/i.test(idea);
  const hasProblem = /problem|challenge|issue|pain point|difficulty/i.test(idea);
  const hasSolution = /solution|solve|address|provide|platform|app|system/i.test(idea);
  
  // Count significant factors
  let qualityFactors = 0;
  if (words > 20) qualityFactors++;
  if (words > 50) qualityFactors++;
  if (hasTargetAudience) qualityFactors += 2;
  if (hasProblem) qualityFactors += 2;
  if (hasSolution) qualityFactors++;
  
  // Calculate score (2-10 range)
  const baseScore = Math.min(10, Math.max(2, 2 + qualityFactors));
  
  // Generate reasoning
  let reasoning = "";
  if (baseScore < 7) {
    const missingElements = [];
    if (!hasTargetAudience) missingElements.push("clear target audience");
    if (!hasProblem) missingElements.push("problem statement");
    if (!hasSolution) missingElements.push("solution approach");
    if (words < 30) missingElements.push("sufficient detail");
    
    reasoning = `Your current idea lacks ${missingElements.join(" and ")}, which may weaken its viability. A stronger business concept should clearly define who your customers are, what specific problem you're solving, and how your solution addresses it uniquely.`;
  } else {
    reasoning = "Your idea demonstrates good clarity, target audience understanding, and problem-solution alignment. It provides a solid foundation for further validation.";
  }
  
  return { score: baseScore, reasoning };
}

async function simulateIdeaImprovement(idea: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // This is a placeholder. In a real implementation, call an AI service.
  // For now, we'll add some structural improvements to the original idea.
  return `${idea.trim()}\n\nTarget Audience: [Specific demographic or market segment that would benefit most from this solution]\n\nProblem: [Clear statement of the pain point or challenge that this business addresses]\n\nSolution: [Detailed description of how your product/service solves the problem]\n\nMarket Opportunity: [Brief note on market size or growth potential]`;
} 