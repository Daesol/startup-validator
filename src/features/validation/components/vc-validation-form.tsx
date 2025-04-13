"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { submitVCValidationForm } from "../actions/submit-vc-validation-form"

export function VCValidationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessIdea: "",
    websiteUrl: "",
    additionalNotes: "",
  })
  const [isFormValid, setIsFormValid] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)

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

    setIsSubmitting(true)

    try {
      const result = await submitVCValidationForm({
        businessIdea: formData.businessIdea,
        websiteUrl: formData.websiteUrl,
        additionalContext: {
          additionalNotes: formData.additionalNotes,
        },
      })
      
      // The redirect will happen automatically due to server action
      // Just keep the loading state to show the button spinner
    } catch (error) {
      // Only show error toast if it's not a redirect
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

  if (isSubmitting) {
    // Instead of replacing the whole page with a loading screen,
    // we just show a loading indicator on the button and disable the form
    // while the server action processes the submission and redirects
    return (
      <Card className="p-4 sm:p-6 w-full max-w-full">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <h3 className="text-xl font-semibold">Submitting Form</h3>
          <p className="text-center text-muted-foreground">
            Redirecting to analysis page...
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 sm:p-6 w-full max-w-full">
      <form onSubmit={handleClientSubmit} className="w-full">
        <div className="space-y-6 w-full">
          <div className="space-y-2 w-full">
            <Label htmlFor="businessIdea" className="flex items-center text-base font-medium">
              Describe your business idea in detail
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-2">
              Our multi-agent AI system will analyze your idea from multiple specialized perspectives and provide a comprehensive VC-style assessment.
            </p>
            <Textarea
              id="businessIdea"
              placeholder="What problem are you solving and how? Who is your target audience? What is your solution? Provide as much detail as possible for a better assessment."
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
            <Label htmlFor="websiteUrl" className="text-base font-medium">
              Website URL (Optional)
            </Label>
            <Input
              id="websiteUrl"
              type="url"
              placeholder="https://example.com"
              value={formData.websiteUrl}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              If you have a website or landing page, our AI can incorporate it into its analysis.
            </p>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="additionalNotes" className="text-base font-medium">
              Additional Context (Optional)
            </Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any other information that might help us understand your business better? Market research, competitors, unique advantages, etc."
              value={formData.additionalNotes}
              onChange={(e) => handleChange("additionalNotes", e.target.value)}
              rows={4}
              className="w-full resize-y"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Share any additional context that might help our agents provide better insights.
            </p>
          </div>

          <div className="space-y-4 w-full">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
              <h3 className="font-medium mb-1">About VC Validation</h3>
              <p className="text-sm">
                This process uses specialized AI agents to analyze different aspects of your business idea - from problem definition to market analysis, competitive positioning, business model, and legal considerations. Each agent will improve your idea and provide a score. The lead agent will then synthesize these insights into a final VC-style report.
              </p>
            </div>
            
            <div className="flex justify-between w-full">
              <Button type="button" variant="outline" onClick={() => router.push("/validate")} disabled={isSubmitting}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting || (submitAttempted && !isFormValid)}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initiating Analysis...
                  </>
                ) : (
                  "Submit for VC Validation"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  )
} 