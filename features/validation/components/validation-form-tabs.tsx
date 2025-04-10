"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdeaTabContent } from "@/features/validation/components/tabs/idea-tab-content"
import { DetailsTabContent } from "@/features/validation/components/tabs/details-tab-content"
import { TeamTabContent } from "@/features/validation/components/tabs/team-tab-content"
import type { FormData } from "@/features/validation/types"

interface ValidationFormTabsProps {
  activeTab: string
  onTabChange: (value: string) => void
  formData: FormData
  handleInputChange: (field: string, value: any) => void
  addCompetitor: () => void
  removeCompetitor: (index: number) => void
  updateCoFounderCount: (count: string) => void
  addSkill: (personIndex: number) => void
  removeSkill: (personIndex: number, skillIndex: number) => void
}

export function ValidationFormTabs({
  activeTab,
  onTabChange,
  formData,
  handleInputChange,
  addCompetitor,
  removeCompetitor,
  updateCoFounderCount,
  addSkill,
  removeSkill,
}: ValidationFormTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="idea">Idea</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>

      <TabsContent value="idea" className="space-y-4 py-3">
        <IdeaTabContent formData={formData} handleInputChange={handleInputChange} />
      </TabsContent>

      <TabsContent value="details" className="py-3">
        <DetailsTabContent
          formData={formData}
          handleInputChange={handleInputChange}
          addCompetitor={addCompetitor}
          removeCompetitor={removeCompetitor}
        />
      </TabsContent>

      <TabsContent value="team" className="space-y-4 py-3">
        <TeamTabContent
          formData={formData}
          handleInputChange={handleInputChange}
          updateCoFounderCount={updateCoFounderCount}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />
      </TabsContent>
    </Tabs>
  )
}
