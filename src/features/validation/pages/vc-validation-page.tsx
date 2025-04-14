"use client"
import { useRouter } from "next/navigation"
import { Target } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageLayout } from "@/components/layouts/page-layout"
import { VCValidationForm } from "@/features/validation/components/vc-validation-form"

export default function VCValidationPage() {
  const router = useRouter()

  return (
    <PageLayout>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Target className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Startup Validator</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-10 px-4">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-2">VC-Style Multi-Agent Validation</h1>
            <p className="text-muted-foreground">Get a comprehensive VC-style analysis from our specialized AI agents</p>
          </div>

          <VCValidationForm />
        </div>
      </main>
    </PageLayout>
  )
} 