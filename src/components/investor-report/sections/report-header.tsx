import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ReportHeaderProps {
  businessType: string
  overallScore: number
  feasibility: string
  investorReadiness: string
  estimatedValuation: string
}

export default function ReportHeader({
  businessType,
  overallScore,
  feasibility,
  investorReadiness,
  estimatedValuation
}: ReportHeaderProps) {
  return (
    <Card className="p-6 bg-card border shadow-sm">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Startup Validator – Full Evaluation Report</h1>
        <p className="text-lg text-muted-foreground">Generated using real venture capital scoring frameworks</p>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-4 bg-muted/50 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Business Type:</span>
          <Badge variant="outline" className="font-medium">{businessType}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Overall Score:</span>
          <Badge variant={overallScore > 80 ? "default" : overallScore > 60 ? "secondary" : "destructive"} 
                 className="font-medium">
            {overallScore} / 100
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Feasibility:</span>
          <span className="font-medium">{feasibility}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Investor Readiness:</span>
          <span className="font-medium">{investorReadiness}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Est. Valuation:</span>
          <span className="font-medium">{estimatedValuation}</span>
        </div>
      </div>
    </Card>
  )
} 