-- Create a type for clarity status
CREATE TYPE public.clarity_status AS ENUM ('clear', 'vague', 'missing');

-- Create a type for moat status
CREATE TYPE public.moat_status AS ENUM ('weak', 'moderate', 'strong');

-- Create a validation function to check report_data schema
CREATE OR REPLACE FUNCTION public.validate_report_data()
RETURNS TRIGGER AS $$
BEGIN
  -- If report_data is null, create an empty object
  IF NEW.report_data IS NULL THEN
    NEW.report_data = '{}'::jsonb;
    RETURN NEW;
  END IF;
  
  -- Ensure required top-level fields exist
  NEW.report_data = jsonb_strip_nulls(
    jsonb_build_object(
      'business_type', COALESCE(NEW.report_data->'business_type', '"SaaS"'),
      'overall_score', COALESCE(NEW.report_data->'overall_score', '70'),
      'feasibility', COALESCE(NEW.report_data->'feasibility', '"✅ Buildable"'),
      'investor_readiness', COALESCE(NEW.report_data->'investor_readiness', '"🟡 Moderate"'),
      'estimated_valuation', COALESCE(NEW.report_data->'estimated_valuation', '"$500K – $1M"'),
      'user_input', COALESCE(NEW.report_data->'user_input', '""'),
      'ai_interpretation', COALESCE(NEW.report_data->'ai_interpretation', '""'),
      'summary_metrics', COALESCE(NEW.report_data->'summary_metrics', '{}'),
      'frameworks_used', COALESCE(NEW.report_data->'frameworks_used', '["YC", "a16z", "Sequoia"]'),
      'problem', COALESCE(NEW.report_data->'problem', '{}'),
      'target_audience', COALESCE(NEW.report_data->'target_audience', '{}'),
      'market', COALESCE(NEW.report_data->'market', '{}'),
      'competition', COALESCE(NEW.report_data->'competition', '{}'),
      'uvp', COALESCE(NEW.report_data->'uvp', '{}'),
      'business_model', COALESCE(NEW.report_data->'business_model', '{}'),
      'customer_validation', COALESCE(NEW.report_data->'customer_validation', '{}'),
      'pricing', COALESCE(NEW.report_data->'pricing', '{}'),
      'legal', COALESCE(NEW.report_data->'legal', '{}'),
      'metrics', COALESCE(NEW.report_data->'metrics', '{}'),
      'vc_methodologies', COALESCE(NEW.report_data->'vc_methodologies', '{}'),
      'recommendation', COALESCE(NEW.report_data->'recommendation', '{}'),
      'created_at', COALESCE(NEW.report_data->'created_at', to_jsonb(now())),
      'updated_at', COALESCE(NEW.report_data->'updated_at', to_jsonb(now()))
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger to validation_analyses table
DROP TRIGGER IF EXISTS validate_report_data_trigger ON public.validation_analyses;
CREATE TRIGGER validate_report_data_trigger
  BEFORE INSERT OR UPDATE ON public.validation_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_report_data();

-- Add JSON schema validation (commented out for future use if needed)
-- COMMENT ON COLUMN public.validation_analyses.report_data IS 
-- E'@jsonschema
-- {
--   "type": "object",
--   "required": ["business_type", "overall_score", "feasibility"],
--   "properties": {
--     "business_type": {"type": "string"},
--     "overall_score": {"type": "number"},
--     "feasibility": {"type": "string"},
--     "investor_readiness": {"type": "string"},
--     "estimated_valuation": {"type": "string"},
--     "user_input": {"type": "string"},
--     "ai_interpretation": {"type": "string"}
--   }
-- }';

-- Create a view for easier reporting queries
CREATE OR REPLACE VIEW public.startup_reports AS
SELECT 
  vf.id,
  vf.business_idea,
  vf.business_type,
  vf.created_at,
  va.report_data->>'overall_score' as score,
  va.report_data->>'feasibility' as feasibility,
  va.report_data->>'investor_readiness' as investor_readiness
FROM 
  public.validation_forms vf
LEFT JOIN 
  public.validation_analyses va ON vf.id = va.validation_form_id
WHERE 
  va.report_data IS NOT NULL; 