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
import { submitGeneralForm } from "../actions/submit-general-form"

export function GeneralValidationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessIdea: "",
    websiteUrl: "",
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

    if (!formData.businessIdea.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitGeneralForm(formData)

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message || "Failed to submit form. Please try again.",
          variant: "destructive",
        })
        return
      }

      // The redirect will be handled by the server action
      // No need to do anything here as the redirect will happen automatically
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
            />
          </div>

          <div className="flex justify-between w-full">
            <Button type="button" variant="outline" onClick={() => router.push("/validate")} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting || (submitAttempted && !isFormValid)}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing & Validating...
                </>
              ) : (
                "Submit for Validation"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
