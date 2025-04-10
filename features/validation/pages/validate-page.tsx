"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Target } from "lucide-react"
import { ValidationForm } from "@/features/validation/components/validation-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageLayout } from "@/components/layouts/page-layout"

export default function ValidatePage() {
  const router = useRouter()

  return (
    <PageLayout>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Target className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Startup Validator</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Validate Your Startup Idea</h1>
            <p className="text-muted-foreground">
              Complete this form to get a professional validation report using real VC methodologies.
            </p>
          </div>

          <ValidationForm />
        </div>
      </main>
    </PageLayout>
  )
}
