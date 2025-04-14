import React from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ValuePropositionSectionProps {
  uvp: {
    one_liner: string
    before_after: {
      before: string
      after: string
    }
    rating: number
  }
}

export default function ValuePropositionSection({
  uvp
}: ValuePropositionSectionProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Unique Value Proposition</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">One-Liner</h3>
          <div className="bg-slate-50 p-4 rounded-md text-center">
            <p className="text-lg font-semibold">{uvp.one_liner}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Before vs After</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-md">
              <h4 className="text-sm font-semibold mb-2 text-red-800">Before</h4>
              <p className="text-sm">{uvp.before_after.before}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h4 className="text-sm font-semibold mb-2 text-green-800">After</h4>
              <p className="text-sm">{uvp.before_after.after}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This comparison shows the user behavior change created by your solution.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">UVP Rating</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Generic</span>
              <span>Distinctive</span>
            </div>
            <Progress value={uvp.rating * 10} className="h-2" />
            <div className="flex justify-between text-xs">
              <span>0</span>
              <span className="font-semibold">{uvp.rating}/10</span>
              <span>10</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 