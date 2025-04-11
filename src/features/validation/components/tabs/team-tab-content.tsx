"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { FormSection } from "../ui/form-section"
import { TeamMemberCard } from "./team-tab/team-member-card"

export function TeamTabContent({ currentSkill, setCurrentSkill, updateCoFounderCount, addSkill, removeSkill }) {
  const { control, watch } = useFormContext()

  const teamMembers = watch("teamMembers") || []

  const handleSkillInputKeyDown = (e, personIndex) => {
    if ((e.key === "Enter" || e.key === ",") && currentSkill.trim()) {
      e.preventDefault()
      addSkill(personIndex, currentSkill)
      setCurrentSkill("")
    }
  }

  const handleAddTeamMember = () => {
    const updatedTeamMembers = [
      ...teamMembers,
      {
        person: `Team member ${teamMembers.length}`,
        skills: [],
      },
    ]
    // Update the form value
    control._formValues.teamMembers = updatedTeamMembers
    // Force re-render
    control._subjects.state.next({
      ...control._formState,
      isDirty: true,
    })
  }

  const handleRemoveTeamMember = (index) => {
    if (index === 0) return // Don't remove the first team member (You)
    const updatedTeamMembers = teamMembers.filter((_, i) => i !== index)
    // Update the form value
    control._formValues.teamMembers = updatedTeamMembers
    // Force re-render
    control._subjects.state.next({
      ...control._formState,
      isDirty: true,
    })
  }

  const handleNameChange = (index, name) => {
    const updatedTeamMembers = [...teamMembers]
    updatedTeamMembers[index].person = name
    // Update the form value
    control._formValues.teamMembers = updatedTeamMembers
    // Force re-render
    control._subjects.state.next({
      ...control._formState,
      isDirty: true,
    })
  }

  return (
    <div className="space-y-6">
      <FormSection title="Team Composition">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-base font-medium">Team Members</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTeamMember}
            className="flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Member
          </Button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              member={member}
              index={index}
              currentSkill={currentSkill}
              onNameChange={handleNameChange}
              onRemove={handleRemoveTeamMember}
              onSkillInputChange={setCurrentSkill}
              onSkillInputKeyDown={handleSkillInputKeyDown}
              onSkillRemove={removeSkill}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Team Status">
        <FormField
          control={control}
          name="coFounderStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Founding Team Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select founding status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="solo">Solo Founder</SelectItem>
                  <SelectItem value="looking">Looking for Co-founders</SelectItem>
                  <SelectItem value="committed">Have Committed Co-founders</SelectItem>
                  <SelectItem value="complete">Complete Founding Team</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="teamGaps"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Key Team Gaps</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary gap" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="technical">Technical Talent</SelectItem>
                  <SelectItem value="sales">Sales & Marketing</SelectItem>
                  <SelectItem value="product">Product Management</SelectItem>
                  <SelectItem value="design">Design & UX</SelectItem>
                  <SelectItem value="domain">Domain Expertise</SelectItem>
                  <SelectItem value="none">No Major Gaps</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormSection>
    </div>
  )
}
