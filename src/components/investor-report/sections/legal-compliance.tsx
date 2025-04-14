import React from "react"
import { Card } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface LegalComplianceSectionProps {
  legal: {
    risks: string[]
    current_state: Record<string, boolean>
    disclaimer_links: Record<string, string>
  }
}

export default function LegalComplianceSection({
  legal
}: LegalComplianceSectionProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Legal & Compliance</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Risk Assessment</h3>
          <ul className="space-y-2">
            {legal.risks.map((risk, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="mr-2 text-amber-500">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Current State</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Document</th>
                  <th className="text-center py-2 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(legal.current_state).map(([document, status], index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-2 px-4">{document}</td>
                    <td className="py-2 px-4 text-center">
                      {status ? (
                        <Check className="h-5 w-5 text-green-500 inline" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 inline" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Disclaimer Links</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(legal.disclaimer_links).map(([label, link], index) => (
              <a 
                key={index} 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 