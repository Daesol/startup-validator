import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"
import { ValidationFormLink } from "@/features/validation/components/validation-form-link"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Process</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How Startup Validator Works</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform dynamically adapts to your business type for accurate analysis.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-4xl">
          <Tabs defaultValue="submit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="submit">Submit</TabsTrigger>
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>
            <TabsContent value="submit" className="p-4 border rounded-lg mt-4">
              <div className="grid gap-4 md:grid-cols-2 items-center">
                <div>
                  <h3 className="text-xl font-bold">Submit Your Idea</h3>
                  <p className="text-muted-foreground mt-2">
                    Enter your startup idea in as little as one sentence or upload your full business plan. Our system
                    accepts various input formats.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Simple text descriptions</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Website URLs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Business plan documents</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="h-2 w-3/4 rounded-lg bg-muted-foreground/20"></div>
                    <div className="h-2 w-1/2 rounded-lg bg-muted-foreground/20"></div>
                    <div className="h-10 w-full rounded-lg bg-muted-foreground/10 mt-4"></div>
                    <ValidationFormLink>
                      <Button className="w-full mt-2">Submit Idea</Button>
                    </ValidationFormLink>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analyze" className="p-4 border rounded-lg mt-4">
              <div className="grid gap-4 md:grid-cols-2 items-center">
                <div>
                  <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                  <p className="text-muted-foreground mt-2">
                    Our system automatically identifies your business type and applies the appropriate frameworks from Y
                    Combinator, Sequoia, a16z, and Techstars.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Business type detection</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Framework selection</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Multi-dimensional scoring</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analyzing...</span>
                      <span className="text-sm text-primary">75%</span>
                    </div>
                    <div className="h-2 w-full rounded-lg bg-muted-foreground/20">
                      <div className="h-full bg-primary rounded-lg" style={{ width: "75%" }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="h-16 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-xs">SaaS</span>
                      </div>
                      <div className="h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="text-xs text-primary font-medium">Marketplace</span>
                      </div>
                      <div className="h-16 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-xs">E-commerce</span>
                      </div>
                      <div className="h-16 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-xs">Hardware</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="report" className="p-4 border rounded-lg mt-4">
              <div className="grid gap-4 md:grid-cols-2 items-center">
                <div>
                  <h3 className="text-xl font-bold">Comprehensive Report</h3>
                  <p className="text-muted-foreground mt-2">
                    Receive a detailed validation report with scores, insights, and actionable recommendations to
                    improve your startup idea.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Overall score out of 100</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Category breakdowns</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Valuation estimates</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>Strategic recommendations</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Startup Score</span>
                      <span className="text-xl font-bold text-primary">78/100</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Team</span>
                        <span>85/100</span>
                      </div>
                      <div className="h-2 w-full bg-muted-foreground/20 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Product</span>
                        <span>70/100</span>
                      </div>
                      <div className="h-2 w-full bg-muted-foreground/20 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Market</span>
                        <span>90/100</span>
                      </div>
                      <div className="h-2 w-full bg-muted-foreground/20 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
