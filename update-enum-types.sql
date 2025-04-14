-- Drop the existing types if they exist
DROP TYPE IF EXISTS public.clarity_status CASCADE;
DROP TYPE IF EXISTS public.moat_status CASCADE;

-- Recreate the clarity_status with capitalized values
CREATE TYPE public.clarity_status AS ENUM ('Clear', 'Vague', 'Not identified');

-- Recreate the moat_status with capitalized values
CREATE TYPE public.moat_status AS ENUM ('Strong', 'Moderate', 'Weak');

-- Update the validation function to handle the correct casing
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