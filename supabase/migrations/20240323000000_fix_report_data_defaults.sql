-- Drop default values from existing columns to set better ones
ALTER TABLE public.validation_analyses 
  ALTER COLUMN market_analysis DROP DEFAULT,
  ALTER COLUMN business_model DROP DEFAULT,
  ALTER COLUMN team_strength DROP DEFAULT,
  ALTER COLUMN overall_assessment DROP DEFAULT;

-- Set proper default values for all JSON/JSONB fields
ALTER TABLE public.validation_analyses 
  ALTER COLUMN market_analysis SET DEFAULT '{}'::jsonb,
  ALTER COLUMN business_model SET DEFAULT '{}'::jsonb,
  ALTER COLUMN team_strength SET DEFAULT '{}'::jsonb,
  ALTER COLUMN overall_assessment SET DEFAULT '{}'::jsonb,
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

-- Update any existing null values to empty objects
UPDATE public.validation_analyses 
SET 
  market_analysis = COALESCE(market_analysis, '{}'::jsonb),
  business_model = COALESCE(business_model, '{}'::jsonb),
  team_strength = COALESCE(team_strength, '{}'::jsonb),
  overall_assessment = COALESCE(overall_assessment, '{}'::jsonb); 