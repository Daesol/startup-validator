"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { submitGeneralForm } from "../actions/submit-general-form"
import { LoadingPage } from "./loading-page"
import { InitialConceptScore } from "@/components/initial-concept-score"

export function GeneralValidationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessIdea: "",
    websiteUrl: "",
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [currentStep, setCurrentStep] = useState<'form' | 'concept-score'>('form')

  const handleChange = (field: string, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value,
    }
    setFormData(newFormData)
    setIsFormValid(newFormData.businessIdea.trim() !== "")
  }

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    if (!formData.businessIdea.trim() || isSubmitting) {
      return
    }

    setCurrentStep('concept-score')
  }

  const handleImprovedIdeaSubmit = async (improvedIdea: string) => {
    setFormData({
      ...formData,
      businessIdea: improvedIdea,
    })

    setIsSubmitting(true)

    try {
      await submitGeneralForm({
        ...formData,
        businessIdea: improvedIdea,
      })
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('NEXT_REDIRECT')) {
        console.error("Error submitting form:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    }
  }

  const handleProceedWithOriginal = async () => {
    setIsSubmitting(true)

    try {
      await submitGeneralForm(formData)
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('NEXT_REDIRECT')) {
        console.error("Error submitting form:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    }
  }

  const handleBackToForm = () => {
    setCurrentStep('form')
  }

  if (isSubmitting) {
    return <LoadingPage />
  }

  if (currentStep === 'concept-score') {
    return (
      <div className="space-y-6">
        <div>
          <Button 
            variant="ghost" 
            onClick={handleBackToForm} 
            className="mb-4 pl-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Form
          </Button>
        </div>
        
        <InitialConceptScore 
          businessIdea={formData.businessIdea}
          onImprovedIdeaSubmit={handleImprovedIdeaSubmit}
          onProceedWithOriginal={handleProceedWithOriginal}
        />
      </div>
    )
  }

  return (
    <Card className="p-4 sm:p-6 w-full max-w-full">
      <form onSubmit={handleClientSubmit} className="w-full">
        <div className="space-y-4 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="businessIdea" className="flex items-center">
              Describe your business idea
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="businessIdea"
              placeholder="What problem are you solving and how? Provide as much detail as possible for a better assessment."
              value={formData.businessIdea}
              onChange={(e) => handleChange("businessIdea", e.target.value)}
              rows={8}
              required
              className="w-full resize-y min-h-[200px]"
              style={{
                borderColor: submitAttempted && !formData.businessIdea.trim() ? "rgb(252, 165, 165)" : undefined,
              }}
              disabled={isSubmitting}
            />
            {submitAttempted && !formData.businessIdea.trim() && (
              <p className="text-xs text-red-500">Business idea is required</p>
            )}
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
            <Input
              id="websiteUrl"
              type="url"
              placeholder="https://example.com"
              value={formData.websiteUrl}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-between w-full">
            <Button type="button" variant="outline" onClick={() => router.push("/validate")} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting || (submitAttempted && !isFormValid)}>
              Continue to Validation
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
