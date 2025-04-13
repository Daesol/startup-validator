import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TargetAudienceSectionProps {
  targetAudience: {
    segments: string[]
    motivation: string
    buyer_user_table: {
      buyer: string
      user: string
    }
    persona_suggestions: string[]
  }
}

export default function TargetAudienceSection({
  targetAudience
}: TargetAudienceSectionProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Target Audience</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Audience Segments</h3>
          <div className="flex flex-wrap gap-2">
            {targetAudience.segments.map((segment, index) => (
              <Badge key={index} variant="secondary" className="bg-slate-100 hover:bg-slate-200">
                {segment}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Motivation Description</h3>
          <p className="text-sm">{targetAudience.motivation}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Buyer ≠ User Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Buyer</th>
                  <th className="text-left py-2 px-4 font-semibold text-muted-foreground">User</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-slate-100">{targetAudience.buyer_user_table.buyer}</td>
                  <td className="py-2 px-4 border-b border-slate-100">{targetAudience.buyer_user_table.user}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Persona Suggestions</h3>
          <ul className="list-disc list-inside space-y-1">
            {targetAudience.persona_suggestions.map((persona, index) => (
              <li key={index} className="text-sm">{persona}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
} 