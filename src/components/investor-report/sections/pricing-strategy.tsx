import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface PricingStrategySectionProps {
  pricing: {
    roi_match: number
    models: string[]
    suggestions: string[]
  }
}

export default function PricingStrategySection({
  pricing
}: PricingStrategySectionProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Pricing Strategy</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">ROI Match (Value-Based Pricing)</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Underpriced</span>
              <span>Value-Aligned</span>
              <span>Overpriced</span>
            </div>
            <Progress value={pricing.roi_match * 10} className="h-2" />
            <div className="flex justify-between text-xs">
              <span>0</span>
              <span className="font-semibold">{pricing.roi_match}/10</span>
              <span>10</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Score shows how well current pricing aligns with the value delivered to customers.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pricing Models</h3>
          <div className="flex flex-wrap gap-2">
            {pricing.models.map((model, index) => (
              <Badge key={index} variant="outline" className="bg-slate-50">
                {model}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Flexibility Suggestions</h3>
          <ul className="space-y-2">
            {pricing.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="mr-2 text-blue-500">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
} 