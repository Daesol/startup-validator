import { getValidationForms } from "@/lib/supabase/validation-service"
import PageLayout from "@/components/layouts/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"

export default async function ValidationsPage() {
  const validations = await getValidationForms()

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Validations</h1>
          <Link href="/validate">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Validation
            </Button>
          </Link>
        </div>

        {validations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4">You haven't created any validations yet.</p>
              <Link href="/validate">
                <Button>Start Your First Validation</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {validations.map((validation) => (
              <Card key={validation.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">
                        {validation.business_idea.substring(0, 60)}
                        {validation.business_idea.length > 60 ? "..." : ""}
                      </CardTitle>
                      <CardDescription>
                        {new Date(validation.created_at).toLocaleDateString()} •{" "}
                        <Badge variant="outline">{validation.form_type === "advanced" ? "Advanced" : "General"}</Badge>
                      </CardDescription>
                    </div>
                    <Link href={`/validations/${validation.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {validation.business_type && (
                      <div>
                        <span className="font-medium">Type:</span> {validation.business_type}
                      </div>
                    )}
                    {validation.business_stage && (
                      <div>
                        <span className="font-medium">Stage:</span> {validation.business_stage}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
