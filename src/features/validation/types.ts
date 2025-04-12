export type ValidationFormValues = {
  businessIdea: string
  websiteUrl?: string
  businessStage?: string
  businessType?: string
  personalProblem?: boolean
  targetAudience?: string
  targetAudienceOther?: string
  charging?: boolean
  differentiation?: string
  competitors?: string[]
  userCount?: string
  mau?: string
  monthlyRevenue?: string
  acquisitionChannel?: string
  revenueRange?: string
  pricingModel?: string
  pricingModelOther?: string
  cac?: string
  ltv?: string
  teamSize?: string
  raisedFunds?: boolean
  fundsRaised?: string
  investors?: string
  coFounderCount?: string
  teamMembers?: Array<{
    person: string
    skills: string[]
  }>
  teamGaps?: string
} 