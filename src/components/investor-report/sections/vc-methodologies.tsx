import React from "react"
import { Card } from "@/components/ui/card"
import { PieChart, Gauge, BriefcaseBusiness, Hourglass, Target } from "lucide-react"

interface VCMethodologiesSectionProps {
  methodologies: Record<string, string>
}

export default function VCMethodologiesSection({
  methodologies
}: VCMethodologiesSectionProps) {
  // Map VC firms to their logos/icons
  const vcIcons: Record<string, React.ReactNode> = {
    "Y Combinator": <PieChart className="h-5 w-5" />,
    "a16z": <Gauge className="h-5 w-5" />,
    "Sequoia": <BriefcaseBusiness className="h-5 w-5" />,
    "Scorecard": <Target className="h-5 w-5" />,
    "Berkus": <Hourglass className="h-5 w-5" />
  }

  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">VC Methodologies Referenced</h2>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This report incorporates evaluation frameworks from leading venture capital firms:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(methodologies).map(([vc, focus], index) => (
            <div key={index} className="flex items-start p-3 border border-slate-200 rounded-md">
              <div className="mr-3 mt-1 bg-slate-100 p-2 rounded-full">
                {vcIcons[vc] || <PieChart className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{vc}</h3>
                <p className="text-sm text-muted-foreground">{focus}</p>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          Each framework contributes different evaluation criteria to provide a holistic assessment.
        </p>
      </div>
    </Card>
  )
} 