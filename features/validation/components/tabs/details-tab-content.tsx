"use client"

import { useFormContext } from "react-hook-form"
import { EarlyStageSection } from "./details-tab/early-stage-section"
import { GrowthStageSection } from "./details-tab/growth-stage-section"

export function DetailsTabContent({ addCompetitor, removeCompetitor }) {
  const { watch } = useFormContext()

  // Watch the businessStage field to determine which form fields to show
  const businessStage = watch("businessStage")

  const isEarlyStage = ["idea", "prototype"].includes(businessStage)
  const isMvpOrLaunched = ["mvp", "launched"].includes(businessStage)
  const isLateStage = ["startup", "growth", "funded"].includes(businessStage)

  if (isEarlyStage) {
    return <EarlyStageSection addCompetitor={addCompetitor} removeCompetitor={removeCompetitor} />
  }

  if (isMvpOrLaunched || isLateStage) {
    return <GrowthStageSection addCompetitor={addCompetitor} removeCompetitor={removeCompetitor} />
  }

  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-muted-foreground">Please select a business stage in the Idea tab first.</p>
    </div>
  )
}
