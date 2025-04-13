import React from "react"
import { Card } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StrategicMetricsSectionProps {
  metrics: {
    success_rate: string
    investment_score: number
    breakeven_point: string
    cac: string
    ltv: string
    roi_year1: string
    market_size_som: string
    scalability_index: number
    mvp_cost: string
  }
}

export default function StrategicMetricsSection({
  metrics
}: StrategicMetricsSectionProps) {
  const tooltips = {
    success_rate: "Estimated probability of achieving product-market fit",
    investment_score: "Overall investment attractiveness on a scale of 0-100",
    breakeven_point: "Estimated time to reach break-even based on projections",
    cac: "Customer Acquisition Cost - estimated cost to acquire one customer",
    ltv: "Lifetime Value - estimated revenue from a typical customer",
    roi_year1: "Return on Investment in the first year",
    market_size_som: "Serviceable Obtainable Market - realistic portion of market to capture",
    scalability_index: "Ability to scale efficiently on a scale of 0-100",
    mvp_cost: "Estimated cost to build a minimum viable product"
  }

  // Helper function to determine signal color
  const getSignalColor = (metric: string, value: any) => {
    if (metric === 'investment_score') {
      return value > 80 ? "🟢" : value > 60 ? "🟡" : "🔴"
    }
    if (metric === 'scalability_index') {
      return value > 80 ? "🟢" : value > 60 ? "🟡" : "🔴"
    }
    // Default good signal for all other metrics
    return "🟢"
  }

  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Strategic Metrics</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Metric</th>
              <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Value</th>
              <th className="text-center py-2 px-4 font-semibold text-muted-foreground">Signal</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(metrics).map(([key, value], index) => (
              <tr key={key} className="border-b border-slate-100">
                <td className="py-3 px-4 flex items-center">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{tooltips[key as keyof typeof tooltips]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="py-3 px-4 font-medium">
                  {typeof value === 'number' && key !== 'investment_score' && key !== 'scalability_index' 
                    ? value.toLocaleString() 
                    : value}
                </td>
                <td className="py-3 px-4 text-center text-lg">
                  {getSignalColor(key, value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
} 