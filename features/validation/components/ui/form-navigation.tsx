"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface FormNavigationProps {
  activeTab: string
  onBack: (e: React.MouseEvent) => void
  onNext: (e: React.MouseEvent) => void
  onCancel: () => void
  isNextDisabled?: boolean
  isLastStep?: boolean
}

export function FormNavigation({
  activeTab,
  onBack,
  onNext,
  onCancel,
  isNextDisabled = false,
  isLastStep = false,
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-4">
      {activeTab !== "idea" ? (
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          Back
        </Button>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Back to Selection
        </Button>
      )}

      {!isLastStep ? (
        <Button type="button" size="sm" onClick={onNext} disabled={isNextDisabled}>
          Next
        </Button>
      ) : (
        <Button type="submit" size="sm">
          Submit
        </Button>
      )}
    </div>
  )
}
