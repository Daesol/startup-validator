import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { ValidationFormLink } from "@/features/validation/components/validation-form-link"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left space-y-4">
            <div className="self-center lg:self-start inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              Instant Startup Idea Evaluation
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Validate Your Startup Idea Like a VC
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Get professional-grade validation reports using real venture capital methodologies from Y Combinator,
              Sequoia, a16z, and Techstars.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <ValidationFormLink className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-1">
                  Validate Your Idea <ChevronRight className="h-4 w-4" />
                </Button>
              </ValidationFormLink>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
              <div className="rounded-lg bg-muted p-4">
                <div className="space-y-3">
                  <div className="h-2 w-3/4 rounded-lg bg-muted-foreground/20"></div>
                  <div className="h-2 w-1/2 rounded-lg bg-muted-foreground/20"></div>
                  <div className="h-2 w-5/6 rounded-lg bg-muted-foreground/20"></div>
                </div>
                <div className="mt-6 rounded-md bg-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Startup Score</div>
                    <div className="text-xl font-bold text-primary">78/100</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Team</span>
                      <div className="w-32 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Product</span>
                      <div className="w-32 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Market</span>
                      <div className="w-32 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
