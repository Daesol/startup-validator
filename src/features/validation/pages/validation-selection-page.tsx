"use client"
import { useRouter } from "next/navigation"
import { Target, FileText, ClipboardList, Briefcase } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageLayout } from "@/components/layouts/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ValidationSelectionPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter mb-2">Choose Validation Type</h1>
            <p className="text-muted-foreground">
              Select the validation method that best fits your needs and current stage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer w-full"
              onClick={() => router.push("/validate/initial")}
            >
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Target className="h-5 w-5 text-primary" />
                  Initial Concept Score
                </CardTitle>
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                    Free
                  </span>
                </div>
                <CardDescription>Quick assessment with improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get an immediate score on your business idea quality and AI-powered suggestions to improve it before proceeding to a full validation.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Instant quality score (1-10)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>AI-powered improvement suggestions</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Under 30 seconds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer w-full"
              onClick={() => router.push("/validate/general")}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="h-5 w-5 text-primary" />
                  General Validation
                </CardTitle>
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                    1 credit
                  </span>
                </div>
                <CardDescription>Quick assessment of your business idea</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for early-stage ideas or when you need quick feedback on a concept. Simply describe your
                  business idea and get an instant assessment.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Simple one-step process</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Basic validation report</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Instant results</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer w-full"
              onClick={() => router.push("/validate/advance")}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Advanced Validation
                </CardTitle>
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                    3 credits
                  </span>
                </div>
                <CardDescription>Comprehensive analysis of your startup</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ideal for startups seeking in-depth validation. Provides detailed analysis across multiple dimensions
                  using VC frameworks.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Multi-step detailed assessment</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Comprehensive validation report</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Actionable recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer w-full"
              onClick={() => router.push("/validate/vc-validation")}
            >
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                Beta
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Briefcase className="h-5 w-5 text-primary" />
                  VC Multi-Agent Validation
                </CardTitle>
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                    Premium
                  </span>
                </div>
                <CardDescription>Advanced analysis with 8 specialized AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our most advanced validation uses 8 specialized AI agents to analyze different aspects of your business, from problem definition to market analysis, competitive positioning, and more.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Specialized agent for each business aspect</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>VC-style recommendation and scoring</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Idea improvement with each agent</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
