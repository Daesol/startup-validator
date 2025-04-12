import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"

const analysisSteps = [
  "Analyzing your business idea",
  "Conducting market research",
  "Evaluating business model",
  "Assessing team strength",
  "Generating final report"
]

// Define a global state manager for the loading progress
type LoadingState = {
  isPaused: boolean;
  progress: number;
  completeProgress: () => void;
}

const defaultState: LoadingState = {
  isPaused: false,
  progress: 0,
  completeProgress: () => {}
};

let globalLoadingState = {...defaultState};

export function completeLoadingProgress() {
  globalLoadingState.completeProgress();
}

export function LoadingPage({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // This effect handles the progress animation with random speed variations and pause at 85%
  useEffect(() => {
    if (progress >= 85 && !isPaused) {
      setIsPaused(true)
      return
    }

    if (isPaused) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Random speed variations to simulate real processing
        const increment = Math.random() * 0.7 + 0.3 // Between 0.3 and 1.0
        
        // Slow down as we approach the pause point
        const adjustedIncrement = prev > 70 ? increment * 0.5 : increment
        
        const nextValue = prev + adjustedIncrement
        
        // Mark steps as completed as progress increases
        const stepValue = (prev / 100) * analysisSteps.length
        const currentStepIndex = Math.floor(stepValue)
        if (currentStepIndex < analysisSteps.length && !completedSteps.includes(currentStepIndex)) {
          setCompletedSteps(prev => [...prev, currentStepIndex])
        }
        
        if (nextValue >= 85) {
          clearInterval(interval)
          return 85
        }
        
        return nextValue
      })
    }, 100)

    return () => clearInterval(interval)
  }, [progress, isPaused, completedSteps])

  // This effect handles the step changes
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= analysisSteps.length - 2) {
          clearInterval(stepInterval)
          return prev
        }
        return prev + 1
      })
    }, 2500)

    return () => clearInterval(stepInterval)
  }, [])

  // Setup the global state for external completion
  useEffect(() => {
    const completeProgress = () => {
      setIsPaused(false)
      setCurrentStep(analysisSteps.length - 1)
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setCompletedSteps([0, 1, 2, 3, 4]) // Mark all steps as completed
            if (onComplete) {
              setTimeout(onComplete, 500)
            }
            return 100
          }
          return prev + 1
        })
      }, 20)
    };

    // Update the global loading state
    globalLoadingState = {
      isPaused,
      progress,
      completeProgress
    };

    return () => {
      globalLoadingState = {...defaultState};
    };
  }, [isPaused, progress, onComplete]);

  // Get title based on progress
  const getTitle = () => {
    if (progress >= 85) {
      return "Polishing Validation Report"
    }
    return "Analyzing Your Startup"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <Card className="p-6 max-w-2xl mx-auto border-primary/20 shadow-lg shadow-primary/5">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-primary">{getTitle()}</h2>
            <p className="text-muted-foreground">
              We're conducting a comprehensive analysis of your startup. This may take a few moments.
            </p>
          </div>
          
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-primary/80 [&>div]:to-primary" 
            />
            <p className="text-sm text-muted-foreground text-right mt-1">
              {Math.round(progress)}%
            </p>
          </div>
          
          <div className="space-y-4 bg-secondary/20 rounded-lg p-4">
            {analysisSteps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = completedSteps.includes(index);
              const isNext = index === currentStep + 1;
              
              return (
                <div 
                  key={step} 
                  className={`flex items-center space-x-4 p-2 rounded-md transition-all duration-300 ${
                    isActive ? 'bg-primary/10' : isCompleted ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isActive ? 'text-primary' : ''}`}>
                      {step}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  )
} 