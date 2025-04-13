-- Migration 1: Add report_data column
-- Add report_data JSONB field to validation_analyses table
ALTER TABLE public.validation_analyses ADD COLUMN IF NOT EXISTS report_data JSONB;

-- Create index for improved query performance
CREATE INDEX IF NOT EXISTS validation_analyses_report_data_idx ON public.validation_analyses USING GIN (report_data);

-- Migration 2: Fix defaults
-- Set proper default value for report_data
ALTER TABLE public.validation_analyses 
  ALTER COLUMN report_data SET DEFAULT null;
  
-- Create a trigger function to ensure we always have proper empty objects, not null
CREATE OR REPLACE FUNCTION public.ensure_json_objects()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure market_analysis is a valid JSONB object
  IF NEW.market_analysis IS NULL THEN
    NEW.market_analysis = '{}'::jsonb;
  END IF;
  
  -- Ensure business_model is a valid JSONB object
  IF NEW.business_model IS NULL THEN
    NEW.business_model = '{}'::jsonb;
  END IF;
  
  -- Ensure team_strength is a valid JSONB object
  IF NEW.team_strength IS NULL THEN
    NEW.team_strength = '{}'::jsonb;
  END IF;
  
  -- Ensure overall_assessment is a valid JSONB object
  IF NEW.overall_assessment IS NULL THEN
    NEW.overall_assessment = '{}'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to validation_analyses table
DROP TRIGGER IF EXISTS ensure_json_objects_trigger ON public.validation_analyses;
CREATE TRIGGER ensure_json_objects_trigger
  BEFORE INSERT OR UPDATE ON public.validation_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_json_objects();

-- Migration 3: Enhance schema
-- Create a type for clarity status if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'clarity_status') THEN
    CREATE TYPE public.clarity_status AS ENUM ('clear', 'vague', 'missing');
  END IF;
END$$;

-- Create a type for moat status if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moat_status') THEN
    CREATE TYPE public.moat_status AS ENUM ('weak', 'moderate', 'strong');
  END IF;
END$$;

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
  
-- Create a view to simplify reporting
CREATE OR REPLACE VIEW public.startup_reports AS
SELECT 
  vf.id,
  vf.business_idea,
  vf.target_audience,
  vf.business_type,
  vf.differentiation,
  vf.pricing_model,
  va.report_data,
  va.created_at,
  va.updated_at
FROM 
  public.validation_forms vf
JOIN 
  public.validation_analyses va ON vf.id = va.validation_form_id
WHERE 
  va.report_data IS NOT NULL; 