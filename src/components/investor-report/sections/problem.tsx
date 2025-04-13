import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ProblemSectionProps {
  problem: {
    summary: string
    clarity_status: string
    pain_severity: number
    alternatives: string[]
    ai_summary: string
  }
}

export default function ProblemSection({
  problem
}: ProblemSectionProps) {
  const clarityColor = 
    problem.clarity_status === "Clear" ? "bg-green-100 text-green-800" :
    problem.clarity_status === "Vague" ? "bg-yellow-100 text-yellow-800" :
    "bg-red-100 text-red-800"

  return (
    <Card className="p-6 border shadow-sm">
      <h2 className="text-xl font-bold mb-4">Problem Identification</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Clarity of Problem</h3>
          <div className="flex justify-between items-center">
            <p className="font-medium">{problem.summary}</p>
            <Badge className={clarityColor}>{problem.clarity_status}</Badge>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pain Severity</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Low Urgency</span>
              <span>High Urgency</span>
            </div>
            <Progress value={problem.pain_severity * 10} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">Urgency to Solve: {problem.pain_severity}/10</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Alternatives / Workarounds</h3>
          <ul className="list-disc list-inside space-y-1">
            {problem.alternatives.map((alternative, index) => (
              <li key={index} className="text-sm">{alternative}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">AI Summary</h3>
          <div className="bg-muted/50 p-4 rounded-md">
            <p className="text-sm">{problem.ai_summary}</p>
            <div className="mt-2">
              <Badge variant="outline" className={clarityColor}>
                {problem.clarity_status} Problem Definition
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 