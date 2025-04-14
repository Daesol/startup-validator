-- Add RPC functions needed for VC validation

-- Function to get agent responses for a validation
CREATE OR REPLACE FUNCTION public.get_vc_validation_agent_responses(validation_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT agent_responses INTO result
  FROM public.vc_validation_analyses
  WHERE id = validation_id;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Function to set a key in a jsonb object
CREATE OR REPLACE FUNCTION public.jsonb_set_key(json_data jsonb, key_name text, new_value jsonb)
RETURNS jsonb AS $$
BEGIN
  RETURN json_data || jsonb_build_object(key_name, new_value);
END;
$$ LANGUAGE plpgsql;

-- Function to check if a VC validation exists
CREATE OR REPLACE FUNCTION public.check_vc_validation_exists(form_id uuid)
RETURNS boolean AS $$
DECLARE
  exists_flag boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.vc_validation_analyses
    WHERE validation_form_id = form_id
  ) INTO exists_flag;
  
  RETURN exists_flag;
END;
$$ LANGUAGE plpgsql;

-- Create tables for VC validation system

-- VC validation analyses table
CREATE TABLE IF NOT EXISTS public.vc_validation_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  validation_form_id UUID NOT NULL REFERENCES public.validation_forms(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  agent_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC(5, 2),
  vc_report JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster lookups by validation_form_id
CREATE INDEX IF NOT EXISTS vc_validation_analyses_validation_form_id_idx
  ON public.vc_validation_analyses(validation_form_id);

-- Create agent analyses table
CREATE TABLE IF NOT EXISTS public.vc_agent_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vc_validation_id UUID NOT NULL REFERENCES public.vc_validation_analyses(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL,
  input_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC(5, 2),
  reasoning TEXT,
  enhanced_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for agent analyses
CREATE INDEX IF NOT EXISTS vc_agent_analyses_validation_id_idx
  ON public.vc_agent_analyses(vc_validation_id);
CREATE INDEX IF NOT EXISTS vc_agent_analyses_agent_type_idx
  ON public.vc_agent_analyses(agent_type);

-- Enable RLS on new tables
ALTER TABLE public.vc_validation_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vc_agent_analyses ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.vc_validation_analyses TO authenticated;
GRANT ALL ON public.vc_agent_analyses TO authenticated;

-- RLS policies for vc_validation_analyses
CREATE POLICY "Users can view their own VC validations"
  ON public.vc_validation_analyses
  FOR SELECT
  USING (
    validation_form_id IN (
      SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own VC validations"
  ON public.vc_validation_analyses
  FOR INSERT
  WITH CHECK (
    validation_form_id IN (
      SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own VC validations"
  ON public.vc_validation_analyses
  FOR UPDATE
  USING (
    validation_form_id IN (
      SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own VC validations"
  ON public.vc_validation_analyses
  FOR DELETE
  USING (
    validation_form_id IN (
      SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
    )
  );

-- RLS policies for vc_agent_analyses
CREATE POLICY "Users can view their own agent analyses"
  ON public.vc_agent_analyses
  FOR SELECT
  USING (
    vc_validation_id IN (
      SELECT id FROM public.vc_validation_analyses
      WHERE validation_form_id IN (
        SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert agent analyses for their own validations"
  ON public.vc_agent_analyses
  FOR INSERT
  WITH CHECK (
    vc_validation_id IN (
      SELECT id FROM public.vc_validation_analyses
      WHERE validation_form_id IN (
        SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their own agent analyses"
  ON public.vc_agent_analyses
  FOR UPDATE
  USING (
    vc_validation_id IN (
      SELECT id FROM public.vc_validation_analyses
      WHERE validation_form_id IN (
        SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their own agent analyses"
  ON public.vc_agent_analyses
  FOR DELETE
  USING (
    vc_validation_id IN (
      SELECT id FROM public.vc_validation_analyses
      WHERE validation_form_id IN (
        SELECT id FROM public.validation_forms WHERE user_id = auth.uid()
      )
    )
  );

-- Create a view that joins validation forms with their VC validations
CREATE OR REPLACE VIEW public.vc_validation_reports AS
SELECT
  vf.id AS form_id,
  vf.user_id,
  vf.business_idea,
  vf.business_model,
  vf.target_audience,
  vf.competitors,
  vf.unique_value,
  vf.revenue_model,
  vf.website,
  vf.created_at AS form_created_at,
  va.id AS validation_id,
  va.status,
  va.score,
  va.agent_responses,
  va.vc_report,
  va.created_at AS validation_created_at,
  va.updated_at AS validation_updated_at
FROM
  public.validation_forms vf
LEFT JOIN
  public.vc_validation_analyses va ON vf.id = va.validation_form_id
WHERE
  va.id IS NOT NULL; 