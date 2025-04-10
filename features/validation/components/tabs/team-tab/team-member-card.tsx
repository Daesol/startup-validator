"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { TeamMember } from "@/features/validation/types"

interface TeamMemberCardProps {
  member: TeamMember
  index: number
  currentSkill: string
  onNameChange: (index: number, name: string) => void
  onRemove: (index: number) => void
  onSkillInputChange: (value: string) => void
  onSkillInputKeyDown: (e: React.KeyboardEvent, index: number) => void
  onSkillRemove: (personIndex: number, skillIndex: number) => void
}

export function TeamMemberCard({
  member,
  index,
  currentSkill,
  onNameChange,
  onRemove,
  onSkillInputChange,
  onSkillInputKeyDown,
  onSkillRemove,
}: TeamMemberCardProps) {
  return (
    <Card className="p-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Person name */}
        <div className="w-full sm:w-1/3">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs text-muted-foreground">Name</Label>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(index)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <Input
            value={member.person}
            onChange={(e) => onNameChange(index, e.target.value)}
            className="h-8 text-sm"
            placeholder="Name"
            disabled={index === 0} // Disable editing for "You"
          />
        </div>

        {/* Skills section */}
        <div className="w-full sm:w-2/3">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs text-muted-foreground">Skills</Label>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[32px] p-1.5 border rounded-md bg-background">
            {/* Display existing skills as tags */}
            {member.skills.map((skill, skillIndex) => (
              <Badge key={skillIndex} variant="secondary" className="px-2 py-0.5 text-xs">
                {skill}
                <X className="ml-1 h-2.5 w-2.5 cursor-pointer" onClick={() => onSkillRemove(index, skillIndex)} />
              </Badge>
            ))}

            {/* Input field for adding new skills */}
            <Input
              value={currentSkill}
              onChange={(e) => onSkillInputChange(e.target.value)}
              onKeyDown={(e) => onSkillInputKeyDown(e, index)}
              className="border-0 h-6 min-w-[120px] flex-grow text-xs p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={member.skills.length === 0 ? "Type skills and press Enter" : "Add more skills..."}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Press Enter or comma to add each skill</p>
        </div>
      </div>
    </Card>
  )
}
