"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StrengthsWeaknessesProps {
  strengths: string[]
  weaknesses: string[]
}

export function StrengthsWeaknesses({ strengths, weaknesses }: StrengthsWeaknessesProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 text-lg leading-tight">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Weaknesses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 text-lg leading-tight">⚠</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 