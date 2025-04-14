"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SuggestedActionsProps {
  actions: string[]
}

export function SuggestedActions({ actions }: SuggestedActionsProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Next Steps</CardTitle>
        <CardDescription>Suggested actions to improve your business</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {actions.map((action, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary h-6 w-6 flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <div>{action}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
} 