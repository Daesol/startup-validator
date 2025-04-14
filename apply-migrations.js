const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dynksioggkqwgivykuvh.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmtzaW9nZ2txd2dpdnlrdXZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDMwNTMwMSwiZXhwIjoyMDU5ODgxMzAxfQ.y42c5kVFKIdVEM-3KG3Xhm2XJmkjEBwvHTXAISISPOw'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigrations() {
  try {
    console.log('Adding report_data column to validation_analyses table...')
    
    // Apply the first migration to add the report_data column
    const { error: addColumnError } = await supabase.rpc('pgmoon_execute_sql', {
      query_text: `
        -- Add report_data JSONB field to validation_analyses table
        ALTER TABLE public.validation_analyses ADD COLUMN IF NOT EXISTS report_data JSONB;
        
        -- Create index for improved query performance
        CREATE INDEX IF NOT EXISTS validation_analyses_report_data_idx ON public.validation_analyses USING GIN (report_data);
      `
    })
    
    if (addColumnError) {
      console.error('Error adding report_data column:', addColumnError)
      return
    }
    
    console.log('Setting proper defaults for JSONB fields...')
    
    // Apply the second migration to fix defaults
    const { error: fixDefaultsError } = await supabase.rpc('pgmoon_execute_sql', {
      query_text: `
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
      `
    })
    
    if (fixDefaultsError) {
      console.error('Error setting defaults:', fixDefaultsError)
      return
    }
    
    console.log('Enhancing report_data schema...')
    
    // Apply the third migration to enhance the schema
    const { error: enhanceSchemaError } = await supabase.rpc('pgmoon_execute_sql', {
      query_text: `
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
      `
    })
    
    if (enhanceSchemaError) {
      console.error('Error enhancing schema:', enhanceSchemaError)
      return
    }
    
    console.log('Database migrations applied successfully!')
    
    // Check if the column exists now
    const { data, error } = await supabase
      .from('validation_analyses')
      .select('id, report_data')
      .limit(1)
    
    if (error) {
      console.error('Error checking for report_data column:', error)
      return
    }
    
    console.log('Validation successful, report_data column exists!')
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

applyMigrations() 