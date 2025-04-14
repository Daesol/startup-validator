import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BusinessModelSectionProps {
  businessModel: {
    pricing_tiers: Array<{
      name: string
      price: string
      features: string[]
    }>
    revenue_estimation: string
    upsell_suggestions: string[]
  }
}

export default function BusinessModelSection({
  businessModel
}: BusinessModelSectionProps) {
  return (
    <Card className="p-6 border-0 shadow-sm">
      <h2 className="text-xl font-bold font-serif mb-4">Business Model</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pricing Table</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessModel.pricing_tiers.map((tier, index) => (
              <div key={index} className={`
                border rounded-md overflow-hidden
                ${tier.name.toLowerCase() === 'free' ? 'border-slate-200' : 
                  tier.name.toLowerCase() === 'pro' ? 'border-blue-200 bg-blue-50' : 
                  'border-purple-200 bg-purple-50'}
              `}>
                <div className={`
                  p-4 text-center border-b
                  ${tier.name.toLowerCase() === 'free' ? 'border-slate-200 bg-slate-50' : 
                    tier.name.toLowerCase() === 'pro' ? 'border-blue-200 bg-blue-100' : 
                    'border-purple-200 bg-purple-100'}
                `}>
                  <h4 className="font-semibold">{tier.name}</h4>
                  <div className="text-xl font-bold mt-1">{tier.price}</div>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm flex items-start">
                        <span className="mr-2 text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Revenue Estimation</h3>
          <div className="bg-slate-50 p-4 rounded-md">
            <p className="text-sm font-medium">{businessModel.revenue_estimation}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Upsell Feature Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {businessModel.upsell_suggestions.map((suggestion, index) => (
              <div key={index} className="bg-slate-50 p-3 rounded-md text-sm">
                <Badge variant="outline" className="mb-1">Upsell</Badge>
                <p>{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
} 