"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { validationFormSchema, type ValidationFormValues } from "../schemas/validation-form-schema"
import { saveValidationForm } from "@/lib/supabase/validation-service"
import { toast } from "@/components/ui/use-toast"

export function useValidationForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("idea")
  const [currentSkill, setCurrentSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form with React Hook Form
  const form = useForm<ValidationFormValues>({
    resolver: zodResolver(validationFormSchema),
    defaultValues: {
      businessIdea: "",
      website: "",
      businessStage: "",
      businessType: "",
      personalProblem: false,
      targetAudience: "",
      targetAudienceOther: "",
      charging: false,
      differentiation: "",
      competitors: [],
      currentCompetitor: "", // Add this field
      userCount: "",
      userCountRange: "",
      mau: "",
      mauRange: "",
      monthlyRevenue: "",
      acquisitionChannel: "",
      revenueRange: "",
      pricingModel: "",
      pricingModelOther: "",
      cac: "",
      ltv: "",
      teamSize: "",
      raisedFunds: false,
      fundsRaised: "",
      investors: "",
      coFounderCount: "0",
      teamMembers: [{ person: "You", skills: [] }],
      coFounderStatus: "",
      teamGaps: "",
      monetizationMethod: "", // Add this field
      fundingStatus: "", // Add this field
    },
  })

  const { watch, setValue, getValues } = form

  // Watch for changes to determine tab validity
  const businessIdea = watch("businessIdea")
  const businessType = watch("businessType")
  const businessStage = watch("businessStage")

  // Determine if the idea tab is valid
  const isIdeaTabValid = businessIdea?.trim() !== "" && businessType?.trim() !== "" && businessStage?.trim() !== ""

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Only allow changing to other tabs if coming from a valid tab or going back
    if (activeTab === "idea" && value !== "idea" && !isIdeaTabValid) {
      return // Prevent tab change if Idea tab is not valid
    }
    setActiveTab(value)
  }

  // Add competitor
  const addCompetitor = (competitor: string) => {
    if (competitor.trim()) {
      const currentCompetitors = getValues("competitors") || []
      setValue("competitors", [...currentCompetitors, competitor.trim()])
    }
  }

  // Remove competitor
  const removeCompetitor = (index: number) => {
    const currentCompetitors = getValues("competitors") || []
    setValue(
      "competitors",
      currentCompetitors.filter((_, i) => i !== index),
    )
  }

  // Add skill to team member
  const addSkill = (personIndex: number, skill: string) => {
    if (skill && skill.trim()) {
      const teamMembers = [...(getValues("teamMembers") || [])]
      if (!teamMembers[personIndex].skills.includes(skill.trim())) {
        teamMembers[personIndex].skills.push(skill.trim())
        setValue("teamMembers", teamMembers)
      }
    }
  }

  // Remove skill from team member
  const removeSkill = (personIndex: number, skillIndex: number) => {
    const teamMembers = [...(getValues("teamMembers") || [])]
    teamMembers[personIndex].skills = teamMembers[personIndex].skills.filter((_, i) => i !== skillIndex)
    setValue("teamMembers", teamMembers)
  }

  // Update co-founder count
  const updateCoFounderCount = (count: string) => {
    const numCount = Number.parseInt(count)
    setValue("coFounderCount", count)

    const currentTeamMembers = getValues("teamMembers") || []
    const currentCount = currentTeamMembers.length
    let updatedTeamMembers = [...currentTeamMembers]

    if (numCount + 1 > currentCount) {
      // Add new team members
      for (let i = currentCount; i < numCount + 1; i++) {
        if (i === 0) {
          updatedTeamMembers.push({ person: "You", skills: [] })
        } else {
          updatedTeamMembers.push({ person: `Co-founder ${i}`, skills: [] })
        }
      }
    } else if (numCount + 1 < currentCount) {
      // Remove excess team members
      updatedTeamMembers = updatedTeamMembers.slice(0, numCount + 1)
    }

    setValue("teamMembers", updatedTeamMembers)
  }

  // Handle next button
  const handleNext = (e?: React.MouseEvent) => {
    // If an event is provided, prevent default behavior
    if (e) {
      e.preventDefault()
    }

    if (activeTab === "idea") {
      if (!isIdeaTabValid) return
      setActiveTab("details")
    } else if (activeTab === "details") {
      setActiveTab("team")
    }
  }

  // Handle back button
  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (activeTab === "details") setActiveTab("idea")
    else if (activeTab === "team") setActiveTab("details")
  }

  // Handle form submission
  const onSubmit = async (data: ValidationFormValues) => {
    setIsSubmitting(true)

    try {
      // Save to Supabase
      const formId = await saveValidationForm(data, "advanced")

      if (!formId) {
        toast({
          title: "Error",
          description: "There was a problem saving your validation. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Store form data in localStorage for the report page
      localStorage.setItem(
        "validationFormData",
        JSON.stringify({
          ...data,
          formId,
          formType: "advanced", // Add metadata to distinguish form types
        }),
      )

      toast({
        title: "Success",
        description: "Your validation has been saved successfully.",
      })

      // Navigate to the report page
      router.push("/validate/report")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your validation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    activeTab,
    currentSkill,
    setCurrentSkill,
    handleTabChange,
    addCompetitor,
    removeCompetitor,
    addSkill,
    removeSkill,
    updateCoFounderCount,
    handleNext,
    handleBack,
    onSubmit,
    isIdeaTabValid,
    isSubmitting,
  }
}
