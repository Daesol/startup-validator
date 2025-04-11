export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      validation_forms: {
        Row: {
          id: string
          business_idea: string
          website: string | null
          business_stage: string | null
          business_type: string | null
          personal_problem: string | null
          target_audience: string | null
          target_audience_other: string | null
          charging: boolean | null
          differentiation: string | null
          competitors: string | null
          user_count: number | null
          mau: number | null
          monthly_revenue: number | null
          acquisition_channel: string | null
          revenue_range: string | null
          pricing_model: string | null
          pricing_model_other: string | null
          cac: number | null
          ltv: number | null
          team_size: number | null
          raised_funds: boolean | null
          funds_raised: number | null
          investors: string | null
          co_founder_count: number | null
          team_members: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          business_idea: string
          website?: string | null
          business_stage?: string | null
          business_type?: string | null
          personal_problem?: string | null
          target_audience?: string | null
          target_audience_other?: string | null
          charging?: boolean | null
          differentiation?: string | null
          competitors?: string | null
          user_count?: number | null
          mau?: number | null
          monthly_revenue?: number | null
          acquisition_channel?: string | null
          revenue_range?: string | null
          pricing_model?: string | null
          pricing_model_other?: string | null
          cac?: number | null
          ltv?: number | null
          team_size?: number | null
          raised_funds?: boolean | null
          funds_raised?: number | null
          investors?: string | null
          co_founder_count?: number | null
          team_members?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          business_idea?: string
          website?: string | null
          business_stage?: string | null
          business_type?: string | null
          personal_problem?: string | null
          target_audience?: string | null
          target_audience_other?: string | null
          charging?: boolean | null
          differentiation?: string | null
          competitors?: string | null
          user_count?: number | null
          mau?: number | null
          monthly_revenue?: number | null
          acquisition_channel?: string | null
          revenue_range?: string | null
          pricing_model?: string | null
          pricing_model_other?: string | null
          cac?: number | null
          ltv?: number | null
          team_size?: number | null
          raised_funds?: boolean | null
          funds_raised?: number | null
          investors?: string | null
          co_founder_count?: number | null
          team_members?: Json | null
          created_at?: string
        }
      }
      validation_analyses: {
        Row: {
          id: string
          validation_form_id: string
          market_analysis: Json
          business_model: Json
          team_strength: Json
          overall_assessment: Json
          created_at: string
        }
        Insert: {
          id?: string
          validation_form_id: string
          market_analysis: Json
          business_model: Json
          team_strength: Json
          overall_assessment: Json
          created_at?: string
        }
        Update: {
          id?: string
          validation_form_id?: string
          market_analysis?: Json
          business_model?: Json
          team_strength?: Json
          overall_assessment?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 