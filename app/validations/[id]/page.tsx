import { getValidationFormWithTeamMembers } from "@/lib/supabase/validation-service"
import PageLayout from "@/components/layouts/page-layout"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function ValidationDetailPage({ params }: { params: { id: string } }) {
  const validation = await getValidationFormWithTeamMembers(params.id)

  if (!validation) {
    notFound()
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/validations">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Validations
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Validation Report</h1>
          <p className="text-muted-foreground">
            {validation.form_type === "advanced" ? "Advanced Validation" : "General Validation"} •
            {new Date(validation.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{validation.business_idea}</p>
              {validation.website && (
                <div className="mt-4">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={validation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {validation.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {validation.form_type === "advanced" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Business Classification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {validation.business_type && (
                      <div>
                        <span className="font-medium">Business Type:</span> {validation.business_type}
                      </div>
                    )}
                    {validation.business_stage && (
                      <div>
                        <span className="font-medium">Business Stage:</span> {validation.business_stage}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Problem & Market</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {validation.personal_problem !== null && (
                      <div>
                        <span className="font-medium">Solving Personal Problem:</span>{" "}
                        {validation.personal_problem ? "Yes" : "No"}
                      </div>
                    )}
                    {validation.target_audience && (
                      <div>
                        <span className="font-medium">Target Audience:</span> {validation.target_audience}
                        {validation.target_audience === "Other" && validation.target_audience_other && (
                          <span> ({validation.target_audience_other})</span>
                        )}
                      </div>
                    )}
                    {validation.charging !== null && (
                      <div>
                        <span className="font-medium">Currently Charging Customers:</span>{" "}
                        {validation.charging ? "Yes" : "No"}
                      </div>
                    )}
                    {validation.differentiation && (
                      <div>
                        <span className="font-medium">Differentiation:</span> {validation.differentiation}
                      </div>
                    )}
                    {validation.competitors && validation.competitors.length > 0 && (
                      <div>
                        <span className="font-medium">Competitors:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {validation.competitors.map((competitor, index) => (
                            <Badge key={index} variant="secondary">
                              {competitor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {(validation.user_count ||
                validation.mau ||
                validation.monthly_revenue ||
                validation.acquisition_channel ||
                validation.revenue_range ||
                validation.pricing_model ||
                validation.cac ||
                validation.ltv ||
                validation.team_size ||
                validation.raised_funds !== null) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {validation.user_count && (
                        <div>
                          <span className="font-medium">User Count:</span> {validation.user_count}
                        </div>
                      )}
                      {validation.mau && (
                        <div>
                          <span className="font-medium">Monthly Active Users:</span> {validation.mau}
                        </div>
                      )}
                      {validation.monthly_revenue && (
                        <div>
                          <span className="font-medium">Monthly Revenue:</span> {validation.monthly_revenue}
                        </div>
                      )}
                      {validation.acquisition_channel && (
                        <div>
                          <span className="font-medium">Main Acquisition Channel:</span>{" "}
                          {validation.acquisition_channel}
                        </div>
                      )}
                      {validation.revenue_range && (
                        <div>
                          <span className="font-medium">Revenue Range:</span> {validation.revenue_range}
                        </div>
                      )}
                      {validation.pricing_model && (
                        <div>
                          <span className="font-medium">Pricing Model:</span> {validation.pricing_model}
                          {validation.pricing_model === "Other" && validation.pricing_model_other && (
                            <span> ({validation.pricing_model_other})</span>
                          )}
                        </div>
                      )}
                      {validation.cac && (
                        <div>
                          <span className="font-medium">Customer Acquisition Cost:</span> {validation.cac}
                        </div>
                      )}
                      {validation.ltv && (
                        <div>
                          <span className="font-medium">Customer Lifetime Value:</span> {validation.ltv}
                        </div>
                      )}
                      {validation.team_size && (
                        <div>
                          <span className="font-medium">Team Size:</span> {validation.team_size}
                        </div>
                      )}
                      {validation.raised_funds !== null && (
                        <div>
                          <span className="font-medium">Raised Funds:</span> {validation.raised_funds ? "Yes" : "No"}
                          {validation.raised_funds && validation.funds_raised && (
                            <div className="mt-1">
                              <span className="font-medium">Amount Raised:</span> {validation.funds_raised}
                            </div>
                          )}
                          {validation.raised_funds && validation.investors && (
                            <div className="mt-1">
                              <span className="font-medium">Investors:</span> {validation.investors}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {validation.team_members && validation.team_members.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Team</CardTitle>
                    {validation.co_founder_count && (
                      <CardDescription>
                        {Number.parseInt(validation.co_founder_count) === 0
                          ? "Solo Founder"
                          : `${validation.co_founder_count} Co-founder${Number.parseInt(validation.co_founder_count) > 1 ? "s" : ""}`}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {validation.team_members.map((member) => (
                        <Card key={member.id} className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{member.person}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {member.skills && member.skills.length > 0 ? (
                              <div>
                                <span className="font-medium">Skills:</span>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {member.skills.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-sm">No skills listed</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
