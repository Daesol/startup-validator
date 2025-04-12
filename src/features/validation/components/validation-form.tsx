"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IdeaTabContent } from "./tabs/idea-tab-content"
import { DetailsTabContent } from "./tabs/details-tab-content"
import { TeamTabContent } from "./tabs/team-tab-content"
import { useValidationForm } from "../hooks/use-validation-form"
import { FormProvider } from "react-hook-form"
import { FormNavigation } from "./ui/form-navigation"
import { LoadingPage } from "./loading-page"

export function ValidationForm() {
  const router = useRouter()
  const {
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
  } = useValidationForm()

  if (isSubmitting) {
    return <LoadingPage />
  }

  return (
    <Card className="p-4">
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (activeTab !== "team") {
              handleNext()
            } else {
              form.handleSubmit(onSubmit)(e)
            }
          }}
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="idea">Idea</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>

            <TabsContent value="idea" className="space-y-4 py-3">
              <IdeaTabContent />
            </TabsContent>

            <TabsContent value="details" className="py-3">
              <DetailsTabContent addCompetitor={addCompetitor} removeCompetitor={removeCompetitor} />
            </TabsContent>

            <TabsContent value="team" className="space-y-4 py-3">
              <TeamTabContent
                currentSkill={currentSkill}
                setCurrentSkill={setCurrentSkill}
                updateCoFounderCount={updateCoFounderCount}
                addSkill={addSkill}
                removeSkill={removeSkill}
              />
            </TabsContent>
          </Tabs>

          <FormNavigation
            activeTab={activeTab}
            onBack={handleBack}
            onNext={handleNext}
            onCancel={() => router.push("/validate")}
            isNextDisabled={activeTab === "idea" && !isIdeaTabValid}
            isLastStep={activeTab === "team"}
            isSubmitting={isSubmitting}
          />
        </form>
      </FormProvider>
    </Card>
  )
}
