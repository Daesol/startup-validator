"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryScoresProps {
  categoryScores: Record<string, number>
}

export function CategoryScores({ categoryScores }: CategoryScoresProps) {
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="p-1.5 rounded-md bg-primary/10 text-primary">📊</span>
          Category Scores
        </CardTitle>
        <CardDescription>Analysis breakdown by specialist agents</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(categoryScores || {}).map(([category, score]) => {
            // Define color based on score
            const colorClass = score >= 8 
              ? "text-green-500 border-green-200 bg-green-50" 
              : score >= 6 
                ? "text-amber-500 border-amber-200 bg-amber-50" 
                : "text-red-500 border-red-200 bg-red-50";
                
            // Calculate percentage for circular progress
            const percentage = score * 10;
            const circumference = 2 * Math.PI * 38; // Circle radius is 38
            const strokeDashoffset = circumference - (percentage / 100) * circumference;
            
            return (
              <div key={category} className={`rounded-lg border p-4 flex flex-col items-center ${colorClass}`}>
                <div className="relative w-[100px] h-[100px] mb-2">
                  {/* Background circle */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="38" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      strokeOpacity="0.2" 
                    />
                    {/* Progress circle */}
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="38" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      strokeDasharray={circumference} 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round" 
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  {/* Score text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{score}</span>
                  </div>
                </div>
                <div className="font-medium text-center capitalize">
                  {category.replace(/_/g, ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
} 