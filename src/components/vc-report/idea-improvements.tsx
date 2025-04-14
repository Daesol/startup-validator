"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface IdeaImprovementsProps {
  originalIdea: string
  improvedIdea?: string
}

export function IdeaImprovements({ originalIdea, improvedIdea }: IdeaImprovementsProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Idea Improvements</CardTitle>
        <CardDescription>Our AI agents have improved your business idea</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Original Idea</h3>
          <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
            {originalIdea}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Improved Idea</h3>
          <div className="bg-primary/10 p-4 rounded-md text-sm whitespace-pre-wrap">
            {improvedIdea || "No improvements suggested."}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 