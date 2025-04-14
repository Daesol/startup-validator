"use client"

import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderSectionProps {
  businessType: string
  overallScore: number | string
  createdAt?: string
  categoryScores?: Record<string, number>
  businessName?: string
}

export function HeaderSection({ 
  businessType, 
  overallScore, 
  createdAt, 
  categoryScores = {},
  businessName
}: HeaderSectionProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  
  // Convert string score to number if needed, handling 'N/A' and other non-numeric values
  const score = 
    typeof overallScore === "number" ? Math.round(overallScore) :
    overallScore === "N/A" || !overallScore ? 0 :
    Math.round(Number.parseFloat(overallScore) || 0)

  // Format date elegantly
  const formattedDate = createdAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(createdAt))
    : "N/A"

  // Filter out the overall score and sort categories by score value
  const sortedCategories = Object.entries(categoryScores)
    .filter(([category]) => category !== "overall")
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)

  // Display business name if available, otherwise fallback to business type
  const displayTitle = businessName || `${businessType} Business`

  return (
    <Card className="border-0 shadow-sm overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Header with score */}
        <div className="relative bg-zinc-900 text-white p-6">
          <div className="flex justify-between items-center">
            {/* Left side - Title and metadata */}
            <div className="space-y-2 flex-1">
              <p className="text-zinc-400 text-sm font-medium">Analysis Report</p>
              <h1 className="text-2xl sm:text-3xl font-light">{businessType}</h1>
              <p className="text-sm text-zinc-400">Multi-Agent VC Analysis • {formattedDate}</p>
            </div>

            {/* Right side - Score (consistent size, vertically centered) */}
            <div className="ml-4 flex items-center">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeDasharray={`${(2 * Math.PI * 45 * score) / 100} ${(2 * Math.PI * 45 * (100 - score)) / 100}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-light">{score}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category performance metrics - Collapsible section */}
        {sortedCategories.length > 0 && (
          <div className="p-4 sm:p-6">
            <Button 
              variant="ghost" 
              className="w-full -ml-2 flex justify-start items-center p-1 text-sm font-medium text-zinc-500 mb-3 hover:bg-zinc-100/50"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              {isCategoryOpen ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Category Performance
            </Button>

            {isCategoryOpen && (
              <div className="space-y-2.5 mt-2">
                {sortedCategories.map(([category, categoryScore]) => {
                  // Determine color based on score
                  const getScoreColor = (score: number) => {
                    if (score >= 8) return "bg-emerald-500"
                    if (score >= 6) return "bg-amber-500"
                    return "bg-rose-500"
                  }

                  const scoreColor = getScoreColor(categoryScore)
                  const percentage = (categoryScore / 10) * 100

                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium capitalize text-zinc-700">
                          {category.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs font-bold text-zinc-900">{categoryScore}</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className={`h-full ${scoreColor} rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 