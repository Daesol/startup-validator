"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface CompetitorInputProps {
  competitors: string[]
  onAdd: (competitor: string) => void
  onRemove: (index: number) => void
}

export function CompetitorInput({ competitors, onAdd, onRemove }: CompetitorInputProps) {
  const [currentCompetitor, setCurrentCompetitor] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && currentCompetitor.trim()) {
      e.preventDefault()
      onAdd(currentCompetitor)
      setCurrentCompetitor("")
    }
  }

  return (
    <div className="space-y-2">
      <Label>Known competitors</Label>
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-1.5 border rounded-md bg-background">
        {/* Display existing competitors as tags */}
        {competitors.map((competitor, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-0.5 text-xs">
            {competitor}
            <X className="ml-1 h-2.5 w-2.5 cursor-pointer" onClick={() => onRemove(index)} />
          </Badge>
        ))}

        {/* Input field for adding new competitors */}
        <Input
          placeholder={competitors.length === 0 ? "Type competitors and press Enter" : "Add more competitors..."}
          value={currentCompetitor}
          onChange={(e) => setCurrentCompetitor(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-0 h-6 min-w-[120px] flex-grow text-xs p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">Press Enter or comma to add each competitor</p>
    </div>
  )
}
