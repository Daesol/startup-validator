export interface TeamMember {
  person: string
  skills: string[]
}

export interface FormData {
  // Idea tab
  businessIdea: string
  website: string
  businessStage: string
  businessType: string

  // Details tab
  personalProblem: boolean
  targetAudience: string
  targetAudienceOther: string
  charging: boolean
  differentiation: string
  competitors: string[]
  currentCompetitor: string

  // Growth metrics
  userCount: string
  mau: string
  monthlyRevenue: string
  acquisitionChannel: string
  revenueRange: string
  pricingModel: string
  pricingModelOther: string
  cac: string
  ltv: string
  teamSize: string
  raisedFunds: boolean
  fundsRaised: string
  investors: string

  // Team tab
  coFounderCount: string
  teamMembers: TeamMember[]
}
