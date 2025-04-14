import React from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FinalRecommendationSectionProps {
  recommendation: {
    summary: string
    next_steps: Array<{
      task: string
      completed: boolean
    }>
  }
}

export default function FinalRecommendationSection({
  recommendation
}: FinalRecommendationSectionProps) {
  return (
    <Card className="p-6 border-0 shadow-sm bg-slate-50">
      <h2 className="text-xl font-bold font-serif mb-4">Final Recommendation</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-md border border-slate-100">
          <p className="text-lg leading-relaxed">
            {recommendation.summary}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Checklist - Next Steps</h3>
          <div className="space-y-3">
            {recommendation.next_steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`step-${index}`} checked={step.completed} />
                <Label htmlFor={`step-${index}`} className="text-sm cursor-pointer">
                  {step.task}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 