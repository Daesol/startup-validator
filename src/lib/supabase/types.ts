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

export interface AnalysisResultRecord {
  id: string
  validation_form_id: string
  market_analysis: {
    market_size: string
    growth_potential: string
    target_audience: string
    competitive_landscape: string
  }
  business_model: {
    revenue_potential: string
    scalability: string
    sustainability: string
    risks: string
  }
  team_strength: {
    expertise: string
    gaps: string
    recommendations: string
  }
  overall_assessment: {
    viability_score: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
  created_at: string
  updated_at: string
}

export interface ValidationWithAnalysis extends ValidationFormRecord {
  analysis: AnalysisResultRecord
  team_members: TeamMemberRecord[]
}

export interface ReportData {
  // Header - Title + Overview
  business_type: string
  overall_score: number
  feasibility: string
  investor_readiness: string
  estimated_valuation: string
  
  // Business Idea Input & Interpretation
  user_input: string
  ai_interpretation: string
  
  // Executive Summary
  summary_metrics: {
    overall_score: number
    feasibility: string
    time_to_mvp: string
    investor_readiness: string
    pre_rev_valuation: string
  }
  frameworks_used: string[]
  
  // Problem Identification
  problem: {
    summary: string
    clarity_status: string
    pain_severity: number
    alternatives: string[]
    ai_summary: string
  }
  
  // Target Audience
  target_audience: {
    segments: string[]
    motivation: string
    buyer_user_table: {
      buyer: string
      user: string
    }
    persona_suggestions: string[]
  }
  
  // Market Research
  market: {
    tam: number
    sam: number
    som: number
    trends: string[]
    why_now: string
  }
  
  // Competitive Analysis
  competition: {
    competitors: Array<{
      name: string
      strengths: string
      weaknesses: string
      price?: string
    }>
    moat_status: string
    positioning: {
      x_axis: number // Customization
      y_axis: number // Trust
    }
  }
  
  // Unique Value Proposition
  uvp: {
    one_liner: string
    before_after: {
      before: string
      after: string
    }
    rating: number
  }
  
  // Business Model
  business_model: {
    pricing_tiers: Array<{
      name: string
      price: string
      features: string[]
    }>
    revenue_estimation: string
    upsell_suggestions: string[]
  }
  
  // Customer Validation
  customer_validation: {
    status: {
      landing_page: boolean
      waitlist: boolean
      interviews: boolean
    }
    best_quote: string
    feedback_stats: {
      signups: number
      feedback_rate: number
    }
  }
  
  // Pricing Strategy
  pricing: {
    roi_match: number
    models: string[]
    suggestions: string[]
  }
  
  // Legal & Compliance
  legal: {
    risks: string[]
    current_state: Record<string, boolean>
    disclaimer_links: Record<string, string>
  }
  
  // Strategic Metrics
  metrics: {
    success_rate: string
    investment_score: number
    breakeven_point: string
    cac: string
    ltv: string
    roi_year1: string
    market_size_som: string
    scalability_index: number
    mvp_cost: string
  }
  
  // VC Methodologies Referenced
  vc_methodologies: Record<string, string>
  
  // Final Recommendation
  recommendation: {
    summary: string
    next_steps: Array<{
      task: string
      completed: boolean
    }>
  }
  
  // Report metadata
  created_at: string
  updated_at: string
}

// Enhanced Analysis record with the new report data field
export interface EnhancedAnalysisResultRecord extends AnalysisResultRecord {
  report_data?: ReportData
}

// Enhanced Validation with the new report data
export interface EnhancedValidationWithAnalysis extends ValidationWithAnalysis {
  analysis: EnhancedAnalysisResultRecord
}

// VC Validation types
export type VCAgentType = 
  | 'problem'
  | 'market'
  | 'competitive'
  | 'uvp'
  | 'business_model'
  | 'validation'
  | 'legal'
  | 'metrics'
  | 'vc_lead'
  | 'market_fit'
  | 'competition'
  | 'team'
  | 'financials'
  | 'traction'
  | 'investor_readiness';

export type VCValidationStatus = 
  | 'pending'
  | 'in_progress'
  | 'processing'
  | 'completed'
  | 'failed';

// Record types for the database tables
export interface VCValidationAnalysisRecord {
  id: string;
  validation_form_id: string;
  status: VCValidationStatus;
  agent_responses: Record<string, any>;
  vc_report: VCReport;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface VCAgentAnalysisRecord {
  id: string;
  vc_validation_id: string;
  agent_type: VCAgentType;
  input_context: Record<string, any>;
  analysis: Record<string, any>;
  score: number;
  reasoning: string;
  enhanced_context: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Agent-specific report structures
export interface ProblemAnalysis {
  improved_problem_statement: string;
  severity_index: number;
  problem_framing: 'global' | 'niche';
  root_causes: string[];
  score: number;
  reasoning: string;
}

export interface MarketAnalysis {
  tam: number;
  sam: number;
  som: number;
  growth_rate: string;
  market_demand: string;
  why_now: string;
  score: number;
  reasoning: string;
}

export interface CompetitiveAnalysis {
  competitors: Array<{
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  differentiation: string;
  moat_classification: 'none' | 'weak' | 'defensible';
  score: number;
  reasoning: string;
}

export interface UVPAnalysis {
  one_liner: string;
  emotional_appeal: string;
  strategic_appeal: string;
  before_after: {
    before: string;
    after: string;
  };
  stickiness_score: number;
  differentiation_clarity: number;
  score: number;
  reasoning: string;
}

export interface BusinessModelAnalysis {
  revenue_model: string;
  pricing_tiers: Array<{
    name: string;
    price: string;
    features: string[];
  }>;
  sustainability_factors: string[];
  monetization_viability: number;
  score: number;
  reasoning: string;
}

export interface ValidationAnalysis {
  current_validation: {
    waitlist: boolean;
    surveys: boolean;
    interviews: boolean;
  };
  validation_suggestions: string[];
  signal_quality: 'none' | 'weak' | 'moderate' | 'strong';
  user_quotes: string[];
  score: number;
  reasoning: string;
}

export interface LegalAnalysis {
  friction_points: string[];
  ethical_concerns: string[];
  operational_liabilities: string[];
  required_disclaimers: string[];
  risk_tags: string[];
  risk_score: number;
  compliance_readiness: 'not_ready' | 'needs_work' | 'ready';
  score: number;
  reasoning: string;
}

export interface MetricsAnalysis {
  roi: string;
  scalability_index: number;
  mvp_budget_estimate: string;
  ltv: string;
  cac: string;
  success_rate: string;
  breakeven_point: string;
  score: number;
  reasoning: string;
}

// Complete VC Report structure
export interface VCReport {
  overall_score: number | string;
  business_type: string;
  weighted_scores: Record<string, number>;
  category_scores: Record<string, number>;
  insights?: Record<string, string[]>;
  idea_improvements?: {
    original_idea: string;
    improved_idea: string;
    problem_statement: string;
    market_positioning: string;
    uvp: string;
    business_model: string;
  };
  recommendation?: string;
  strengths?: string[];
  weaknesses?: string[];
  suggested_actions?: string[];
  
  // Fields for tracking partial completion
  partial_completion?: boolean;
  completed_agents?: VCAgentType[];
  failed_agents?: VCAgentType[];
  generation_method?: string;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
}

// Combined Record with Analysis
export interface VCValidationWithAnalyses {
  form: ValidationFormRecord;
  validation: VCValidationAnalysisRecord;
  agent_analyses: VCAgentAnalysisRecord[];
}
