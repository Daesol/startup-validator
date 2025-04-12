import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
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
        
        if (nextValue >= 85) {
          clearInterval(interval)
          return 85
        }
        
        return nextValue
      })
    }, 100)

    return () => clearInterval(interval)
  }, [progress, isPaused])

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

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Analyzing Your Startup</h2>
        <p className="text-center text-muted-foreground">
          We're conducting a comprehensive analysis of your startup. This may take a few moments.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{analysisSteps[currentStep]}</p>
              <Progress value={progress} className="mt-2 h-3" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 