"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PageLayout from "@/components/layouts/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"
import type { ValidationFormValues } from "@/features/validation/schemas/validation-form-schema"

interface ValidationReportData extends ValidationFormValues {
  formId?: string
  formType: "general" | "advanced"
  isAIEnhanced?: boolean
}

export default function ValidationReportPage() {
  const router = useRouter()
  const [reportData, setReportData] = useState<ValidationReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get the validation data from localStorage
    const storedData = localStorage.getItem("validationFormData")
    if (!storedData) {
      router.push("/validate")
      return
    }

    try {
      const parsedData = JSON.parse(storedData) as ValidationReportData
      setReportData(parsedData)
    } catch (error) {
      console.error("Error parsing validation data:", error)
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <p>Loading validation report...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!reportData) {
    return (
      <PageLayout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <p>No validation data found.</p>
            <Button onClick={() => router.push("/validate")}>Go to Validation</Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/validate">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Validation
            </Button>
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Validation Report</h1>
              <p className="text-muted-foreground">
                {reportData.formType === "advanced" ? "Advanced Validation" : "General Validation"}
                {reportData.isAIEnhanced && " • AI Enhanced"}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Idea</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{reportData.businessIdea}</p>
              {reportData.website && (
                <div className="mt-4">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={reportData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {reportData.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Classification</CardTitle>
              {reportData.isAIEnhanced && <CardDescription>AI-generated based on your business idea</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <span className="font-medium">Business Type:</span> {reportData.businessType}
                </div>
                <div>
                  <span className="font-medium">Business Stage:</span> {reportData.businessStage}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Problem & Market</CardTitle>
              {reportData.isAIEnhanced && <CardDescription>AI-generated based on your business idea</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Solving Personal Problem:</span>{" "}
                  {reportData.personalProblem ? "Yes" : "No"}
                </div>
                {reportData.targetAudience && (
                  <div>
                    <span className="font-medium">Target Audience:</span> {reportData.targetAudience}
                    {reportData.targetAudience === "Other" && reportData.targetAudienceOther && (
                      <span> ({reportData.targetAudienceOther})</span>
                    )}
                  </div>
                )}
                <div>
                  <span className="font-medium">Currently Charging Customers:</span>{" "}
                  {reportData.charging ? "Yes" : "No"}
                </div>
                {reportData.differentiation && (
                  <div>
                    <span className="font-medium">Differentiation:</span> {reportData.differentiation}
                  </div>
                )}
                {reportData.competitors && reportData.competitors.length > 0 && (
                  <div>
                    <span className="font-medium">Competitors:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {reportData.competitors.map((competitor, index) => (
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

          {(reportData.userCount ||
            reportData.mau ||
            reportData.monthlyRevenue ||
            reportData.acquisitionChannel ||
            reportData.revenueRange ||
            reportData.pricingModel) && (
            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
                {reportData.isAIEnhanced && <CardDescription>AI-generated based on your business idea</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {reportData.userCount && (
                    <div>
                      <span className="font-medium">User Count:</span> {reportData.userCount}
                    </div>
                  )}
                  {reportData.mau && (
                    <div>
                      <span className="font-medium">Monthly Active Users:</span> {reportData.mau}
                    </div>
                  )}
                  {reportData.monthlyRevenue && (
                    <div>
                      <span className="font-medium">Monthly Revenue:</span> {reportData.monthlyRevenue}
                    </div>
                  )}
                  {reportData.acquisitionChannel && (
                    <div>
                      <span className="font-medium">Main Acquisition Channel:</span> {reportData.acquisitionChannel}
                    </div>
                  )}
                  {reportData.revenueRange && (
                    <div>
                      <span className="font-medium">Revenue Range:</span> {reportData.revenueRange}
                    </div>
                  )}
                  {reportData.pricingModel && (
                    <div>
                      <span className="font-medium">Pricing Model:</span> {reportData.pricingModel}
                      {reportData.pricingModel === "Other" && reportData.pricingModelOther && (
                        <span> ({reportData.pricingModelOther})</span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {reportData.teamMembers && reportData.teamMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
                {reportData.isAIEnhanced && <CardDescription>AI-generated based on your business idea</CardDescription>}
                <CardDescription>
                  {Number.parseInt(reportData.coFounderCount || "0") === 0
                    ? "Solo Founder"
                    : `${reportData.coFounderCount} Co-founder${
                        Number.parseInt(reportData.coFounderCount || "0") > 1 ? "s" : ""
                      }`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reportData.teamMembers.map((member, index) => (
                    <Card key={index} className="border shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{member.person}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {member.skills && member.skills.length > 0 ? (
                          <div>
                            <span className="font-medium">Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {member.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
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

          <div className="flex justify-center mt-4">
            <Button onClick={() => router.push("/validate")} className="w-full max-w-md">
              Start a New Validation
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
