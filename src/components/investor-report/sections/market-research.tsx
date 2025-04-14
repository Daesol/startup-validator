import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MarketResearchSectionProps {
  market: {
    tam: number
    sam: number
    som: number
    trends: string[]
    why_now: string
  }
}

export default function MarketResearchSection({
  market
}: MarketResearchSectionProps) {
  // Format numbers with commas and dollar signs
  const formatNumber = (num: number) => {
    if (num === 0) return "N/A"
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num}`
  }

  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Market Research</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">TAM/SAM/SOM Breakdown</h3>
          <div className="relative">
            <div className="bg-blue-100 p-4 rounded-md mb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">TAM (Total Available Market)</span>
                <span className="font-bold">{formatNumber(market.tam)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total market demand for the product/service</p>
            </div>
            
            <div className="bg-blue-200 p-4 rounded-md mb-2 ml-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">SAM (Serviceable Available Market)</span>
                <span className="font-bold">{formatNumber(market.sam)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Portion of TAM targeted by products/services</p>
            </div>
            
            <div className="bg-blue-300 p-4 rounded-md ml-8">
              <div className="flex justify-between items-center">
                <span className="font-medium">SOM (Serviceable Obtainable Market)</span>
                <span className="font-bold">{formatNumber(market.som)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Realistic portion of SAM to capture</p>
            </div>
            
            {/* Connecting lines for the pyramid visualization */}
            <div className="absolute top-[56px] left-4 h-8 w-[2px] bg-blue-400"></div>
            <div className="absolute top-[112px] left-8 h-8 w-[2px] bg-blue-500"></div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Market Trends</h3>
            <ul className="list-disc list-inside space-y-2">
              {market.trends.map((trend, index) => (
                <li key={index} className="text-sm">{trend}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Why Now?</h3>
            <div className="bg-slate-50 p-4 rounded-md">
              <Badge variant="secondary" className="mb-2">Timing Factor</Badge>
              <p className="text-sm">{market.why_now}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 