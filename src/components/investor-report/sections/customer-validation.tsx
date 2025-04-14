import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"

interface CustomerValidationSectionProps {
  customerValidation: {
    status: {
      landing_page: boolean
      waitlist: boolean
      interviews: boolean
    }
    best_quote: string
    feedback_stats: {
      signups: number
      feedback_rate: number
    }
  }
}

export default function CustomerValidationSection({
  customerValidation
}: CustomerValidationSectionProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Customer Validation</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Validation Checklist</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              {customerValidation.status.landing_page ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 mr-2" />
              )}
              <span className="text-sm">Landing page created</span>
            </li>
            <li className="flex items-center">
              {customerValidation.status.waitlist ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 mr-2" />
              )}
              <span className="text-sm">Waitlist established</span>
            </li>
            <li className="flex items-center">
              {customerValidation.status.interviews ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 mr-2" />
              )}
              <span className="text-sm">Customer interviews conducted</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Best Quote or Insight</h3>
          <div className="bg-slate-50 p-4 rounded-md">
            <blockquote className="text-sm italic border-l-4 border-blue-200 pl-4">
              "{customerValidation.best_quote}"
            </blockquote>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Feedback Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">{customerValidation.feedback_stats.signups}</div>
              <div className="text-xs text-muted-foreground">Total Signups</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">{customerValidation.feedback_stats.feedback_rate}%</div>
              <div className="text-xs text-muted-foreground">Feedback Rate</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 