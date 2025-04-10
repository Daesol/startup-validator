"use client"

import { BusinessInfoSection } from "./idea-tab/business-info-section"
import { BusinessClassificationSection } from "./idea-tab/business-classification-section"

export function IdeaTabContent() {
  return (
    <div className="space-y-6">
      <BusinessInfoSection />
      <BusinessClassificationSection />
    </div>
  )
}
