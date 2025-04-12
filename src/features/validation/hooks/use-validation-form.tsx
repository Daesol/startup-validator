import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"

export function useValidationForm() {
  const router = useRouter()
  const form = useForm<ValidationFormValues>({
    resolver: zodResolver(validationFormSchema),
    defaultValues: {
      businessIdea: "",
      websiteUrl: "",
      businessStage: "idea",
      personalProblem: false,
      competitors: [],
      teamMembers: [],
    },
  })

  const [activeTab, setActiveTab] = useState("idea")
  const [currentSkill, setCurrentSkill] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ... other hooks

  const onSubmit = async (data: ValidationFormValues) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      await submitAdvanceForm(data)
      // The redirect will happen through the server action
    } catch (error) {
      // Only show error if it's not a Next.js redirect
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

  // ... rest of the hook code

  return {
    form,
    activeTab,
    formData,
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
    isSubmitting
  }
} 