"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import type { ValidationWithAnalysis } from "@/lib/supabase/types"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function ReportPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validation, setValidation] = useState<ValidationWithAnalysis | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        // First, get the validation form
        const { data: formData, error: formError } = await supabase
          .from("validation_forms")
          .select("*")
          .eq("id", params.id)
          .single()

        if (formError) {
          throw formError
        }

        // Then, get the analysis
        const { data: analysisData, error: analysisError } = await supabase
          .from("validation_analyses")
          .select("*")
          .eq("validation_form_id", params.id)
          .single()

        if (analysisError) {
          throw analysisError
        }

        // Finally, get the team members
        const { data: teamData, error: teamError } = await supabase
          .from("team_members")
          .select("*")
          .eq("validation_form_id", params.id)

        if (teamError) {
          throw teamError
        }

        // Combine all the data
        setValidation({
          ...formData,
          analysis: analysisData,
          team_members: teamData || [],
        })
      } catch (error) {
        console.error("Error fetching analysis:", error)
        setError("Failed to load analysis. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAnalysis()
    }
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    )
  }

  if (!validation || !validation.analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Not Found</h2>
          <p>No analysis found for this validation.</p>
        </Card>
      </div>
    )
  }

  const { analysis } = validation

  return (
    <div className="container py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Validation Report</h1>

        {/* Overall Assessment */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overall Assessment</h2>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Viability Score</span>
              <span className="text-sm font-medium">{analysis.overall_assessment.viability_score}%</span>
            </div>
            <Progress value={analysis.overall_assessment.viability_score} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Strengths</h3>
              <ul className="space-y-2">
                {analysis.overall_assessment.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <Badge variant="default" className="mr-2">✓</Badge>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Weaknesses</h3>
              <ul className="space-y-2">
                {analysis.overall_assessment.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <Badge variant="destructive" className="mr-2">!</Badge>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="space-y-2">
              {analysis.overall_assessment.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <Badge variant="outline" className="mr-2">→</Badge>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Market Analysis */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Market Analysis</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Market Size</h3>
              <p>{analysis.market_analysis.market_size}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Growth Potential</h3>
              <p>{analysis.market_analysis.growth_potential}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Target Audience</h3>
              <p>{analysis.market_analysis.target_audience}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Competitive Landscape</h3>
              <p>{analysis.market_analysis.competitive_landscape}</p>
            </div>
          </div>
        </Card>

        {/* Business Model */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Business Model</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Revenue Potential</h3>
              <p>{analysis.business_model.revenue_potential}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Scalability</h3>
              <p>{analysis.business_model.scalability}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Sustainability</h3>
              <p>{analysis.business_model.sustainability}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Risks</h3>
              <p>{analysis.business_model.risks}</p>
            </div>
          </div>
        </Card>

        {/* Team Strength */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Team Strength</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Expertise</h3>
              <p>{analysis.team_strength.expertise}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Gaps</h3>
              <p>{analysis.team_strength.gaps}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Recommendations</h3>
              <p>{analysis.team_strength.recommendations}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 