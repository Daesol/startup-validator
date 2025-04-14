import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CompetitiveAnalysisSectionProps {
  competition: {
    competitors: Array<{
      name: string
      strengths: string
      weaknesses: string
    }>
    moat_status: string
    positioning: {
      x_axis: number // Customization
      y_axis: number // Trust
    }
  }
}

export default function CompetitiveAnalysisSection({
  competition
}: CompetitiveAnalysisSectionProps) {
  const moatColorMap = {
    'Strong': 'bg-green-100 text-green-800',
    'Moderate': 'bg-yellow-100 text-yellow-800',
    'Weak': 'bg-red-100 text-red-800'
  }
  
  const moatColor = moatColorMap[competition.moat_status as keyof typeof moatColorMap] || 'bg-slate-100 text-slate-800'

  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Competitive Analysis</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Competitor Matrix</h3>
            <Badge className={moatColor}>Moat Status: {competition.moat_status}</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Competitor</th>
                  <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Strengths</th>
                  <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Weaknesses</th>
                </tr>
              </thead>
              <tbody>
                {competition.competitors.map((competitor, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-2 px-4 font-medium">{competitor.name}</td>
                    <td className="py-2 px-4">{competitor.strengths}</td>
                    <td className="py-2 px-4">{competitor.weaknesses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Positioning Chart</h3>
          <div className="relative h-64 border border-slate-200 rounded-md p-2">
            {/* X and Y axis labels */}
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 text-xs text-muted-foreground">
              Customization
            </div>
            <div className="absolute top-1/2 left-0 transform -rotate-90 -translate-y-1/2 text-xs text-muted-foreground">
              Trust
            </div>
            
            {/* Positioning dot for your product */}
            <div 
              className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: `${(competition.positioning.x_axis / 10) * 100}%`,
                top: `${100 - ((competition.positioning.y_axis / 10) * 100)}%`,
              }}
            ></div>
            
            {/* Positioning text label */}
            <div 
              className="absolute bg-white text-xs font-medium px-1 rounded shadow-sm transform -translate-x-1/2"
              style={{
                left: `${(competition.positioning.x_axis / 10) * 100}%`,
                top: `${100 - ((competition.positioning.y_axis / 10) * 100) + 10}%`,
              }}
            >
              Your Product
            </div>
            
            {/* Grid lines for better visualization */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="border-t border-slate-100 h-0 col-span-5" style={{ top: `${((i + 1) / 5) * 100}%` }}></div>
                  <div className="border-l border-slate-100 w-0 row-span-5" style={{ left: `${((i + 1) / 5) * 100}%` }}></div>
                </React.Fragment>
              ))}
            </div>
            
            {/* Competitor dots (would be populated dynamically in a real implementation) */}
            {competition.competitors.slice(0, 3).map((competitor, index) => {
              // Generate semi-random positions for the example
              const xPos = Math.max(10, Math.min(90, (competition.positioning.x_axis / 10) * 100 - 15 + (index * 15)))
              const yPos = Math.max(10, Math.min(90, 100 - ((competition.positioning.y_axis / 10) * 100) - 10 - (index * 10)))
              
              return (
                <React.Fragment key={index}>
                  <div 
                    className="absolute w-3 h-3 bg-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                    }}
                  ></div>
                  <div 
                    className="absolute bg-white text-xs px-1 rounded transform -translate-x-1/2"
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos + 8}%`,
                    }}
                  >
                    {competitor.name}
                  </div>
                </React.Fragment>
              )
            })}
          </div>
          <div className="text-xs text-center text-muted-foreground mt-2">
            X = Customization, Y = Trust
          </div>
        </div>
      </div>
    </Card>
  )
} 