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
      vc_validation_analyses: {
        Row: {
          id: string
          validation_form_id: string
          status: string
          agent_responses: Json
          score: number | null
          vc_report: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          validation_form_id: string
          status?: string
          agent_responses?: Json
          score?: number | null
          vc_report?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          validation_form_id?: string
          status?: string
          agent_responses?: Json
          score?: number | null
          vc_report?: Json
          created_at?: string
          updated_at?: string
        }
      }
      vc_agent_analyses: {
        Row: {
          id: string
          vc_validation_id: string
          agent_type: string
          input_context: Json
          analysis: Json
          score: number | null
          reasoning: string | null
          enhanced_context: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vc_validation_id: string
          agent_type: string
          input_context?: Json
          analysis?: Json
          score?: number | null
          reasoning?: string | null
          enhanced_context?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vc_validation_id?: string
          agent_type?: string
          input_context?: Json
          analysis?: Json
          score?: number | null
          reasoning?: string | null
          enhanced_context?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      vc_validation_reports: {
        Row: {
          form_id: string
          user_id: string | null
          business_idea: string
          business_model: string | null
          target_audience: string | null
          competitors: string | null
          unique_value: string | null
          revenue_model: string | null
          website: string | null
          form_created_at: string
          validation_id: string
          status: string
          score: number | null
          agent_responses: Json
          vc_report: Json
          validation_created_at: string
          validation_updated_at: string
        }
      }
    }
    Functions: {
      get_vc_validation_agent_responses: {
        Args: {
          validation_id: string
        }
        Returns: Json
      }
      jsonb_set_key: {
        Args: {
          json_data: Json
          key_name: string
          new_value: Json
        }
        Returns: Json
      }
      check_vc_validation_exists: {
        Args: {
          form_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 