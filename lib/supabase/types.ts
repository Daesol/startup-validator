export interface ValidationFormRecord {
  id: string
  form_type: string
  business_idea: string
  website?: string
  business_stage?: string
  business_type?: string
  personal_problem?: boolean
  target_audience?: string
  target_audience_other?: string
  charging?: boolean
  differentiation?: string
  competitors?: string[]
  user_count?: string
  mau?: string
  monthly_revenue?: string
  acquisition_channel?: string
  revenue_range?: string
  pricing_model?: string
  pricing_model_other?: string
  cac?: string
  ltv?: string
  team_size?: string
  raised_funds?: boolean
  funds_raised?: string
  investors?: string
  co_founder_count?: string
  created_at: string
  updated_at: string
}

export interface TeamMemberRecord {
  id: string
  validation_form_id: string
  person: string
  skills: string[]
  created_at: string
}

export interface ValidationWithTeamMembers extends ValidationFormRecord {
  team_members: TeamMemberRecord[]
}
