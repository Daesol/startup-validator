"use client"

import React from "react"

interface ReportFooterProps {
  createdAt?: string
}

export function ReportFooter({ createdAt }: ReportFooterProps) {
  return (
    <div className="text-center text-sm text-muted-foreground py-4">
      <p>VC Multi-Agent Validation Report | Generated on {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}</p>
    </div>
  )
} 