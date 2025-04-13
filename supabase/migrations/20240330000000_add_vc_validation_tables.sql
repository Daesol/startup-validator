-- Create new validation form type for VC validation
ALTER TYPE public.form_type ADD VALUE 'vc_validation' AFTER 'general';

-- Create a new table for VC validation records
CREATE TABLE public.vc_validation_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_form_id UUID NOT NULL REFERENCES public.validation_forms(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  agent_responses JSONB DEFAULT '{}'::jsonb,
  vc_report JSONB DEFAULT '{}'::jsonb,
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.vc_validation_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select vc_validation_analyses" 
  ON public.vc_validation_analyses FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert vc_validation_analyses"
  ON public.vc_validation_analyses FOR INSERT
  TO service_role 
  WITH CHECK (true);

CREATE POLICY "Service role can update vc_validation_analyses"
  ON public.vc_validation_analyses FOR UPDATE
  TO service_role
  USING (true);

-- Create types for agent categories
CREATE TYPE public.vc_agent_type AS ENUM (
  'problem',
  'market',
  'competitive',
  'uvp',
  'business_model',
  'validation',
  'legal',
  'metrics',
  'vc_lead'
);

-- Create a table for storing agent analyses
CREATE TABLE public.vc_agent_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vc_validation_id UUID NOT NULL REFERENCES public.vc_validation_analyses(id) ON DELETE CASCADE,
  agent_type public.vc_agent_type NOT NULL,
  input_context JSONB NOT NULL,
  analysis JSONB NOT NULL,
  score INTEGER NOT NULL,
  reasoning TEXT,
  enhanced_context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for agent analyses
ALTER TABLE public.vc_agent_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select vc_agent_analyses" 
  ON public.vc_agent_analyses FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert vc_agent_analyses"
  ON public.vc_agent_analyses FOR INSERT
  TO service_role 
  WITH CHECK (true);

CREATE POLICY "Service role can update vc_agent_analyses"
  ON public.vc_agent_analyses FOR UPDATE
  TO service_role
  USING (true);

-- Create a validation function to ensure the VC report structure is consistent
CREATE OR REPLACE FUNCTION public.validate_vc_report()
RETURNS TRIGGER AS $$
BEGIN
  -- If vc_report is null, create an empty object
  IF NEW.vc_report IS NULL THEN
    NEW.vc_report = '{}'::jsonb;
    RETURN NEW;
  END IF;
  
  -- Ensure required top-level fields exist
  NEW.vc_report = jsonb_strip_nulls(
    jsonb_build_object(
      'overall_score', COALESCE(NEW.vc_report->'overall_score', '0'),
      'business_type', COALESCE(NEW.vc_report->'business_type', '"Unspecified"'),
      'weighted_scores', COALESCE(NEW.vc_report->'weighted_scores', '{}'),
      'category_scores', COALESCE(NEW.vc_report->'category_scores', '{}'),
      'recommendation', COALESCE(NEW.vc_report->'recommendation', '""'),
      'strengths', COALESCE(NEW.vc_report->'strengths', '[]'),
      'weaknesses', COALESCE(NEW.vc_report->'weaknesses', '[]'),
      'suggested_actions', COALESCE(NEW.vc_report->'suggested_actions', '[]'),
      'idea_improvements', COALESCE(NEW.vc_report->'idea_improvements', '{}'),
      'created_at', COALESCE(NEW.vc_report->'created_at', to_jsonb(now())),
      'updated_at', to_jsonb(now())
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger to vc_validation_analyses table
CREATE TRIGGER validate_vc_report_trigger
  BEFORE INSERT OR UPDATE ON public.vc_validation_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_vc_report();

-- Create a view for easier reporting queries
CREATE OR REPLACE VIEW public.vc_validation_reports AS
SELECT 
  vf.id,
  vf.business_idea,
  vf.business_type,
  vf.created_at,
  vca.status,
  vca.score,
  vca.vc_report->>'business_type' as idea_type,
  vca.vc_report->>'recommendation' as recommendation
FROM 
  public.validation_forms vf
JOIN 
  public.vc_validation_analyses vca ON vf.id = vca.validation_form_id;

-- Add an index to improve query performance
CREATE INDEX idx_vc_validation_form_id ON public.vc_validation_analyses(validation_form_id);
CREATE INDEX idx_vc_agent_analyses_validation_id ON public.vc_agent_analyses(vc_validation_id); 