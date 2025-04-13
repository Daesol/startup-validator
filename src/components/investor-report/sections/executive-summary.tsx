import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ExecutiveSummaryProps {
  metrics: {
    overall_score: number
    feasibility: string
    time_to_mvp: string
    investor_readiness: string
    pre_rev_valuation: string
  }
  frameworks: string[]
}

export default function ExecutiveSummary({
  metrics,
  frameworks
}: ExecutiveSummaryProps) {
  return (
    <Card className="p-6 border shadow-sm">
      <h2 className="text-xl font-bold mb-4">Executive Summary</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-muted-foreground">Overall Score</td>
                <td className="py-2 text-right font-semibold">{metrics.overall_score} / 100</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-muted-foreground">Feasibility</td>
                <td className="py-2 text-right">{metrics.feasibility}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-muted-foreground">Time to MVP</td>
                <td className="py-2 text-right">{metrics.time_to_mvp}</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-muted-foreground">Investor Readiness</td>
                <td className="py-2 text-right">{metrics.investor_readiness}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-muted-foreground">Pre-Rev Valuation</td>
                <td className="py-2 text-right font-semibold">{metrics.pre_rev_valuation}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="md:w-1/3">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Frameworks Used</h3>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((framework, index) => (
              <Badge key={index} variant="outline" className="bg-muted/50">
                {framework}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 