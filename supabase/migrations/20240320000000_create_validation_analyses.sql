-- Create validation_analyses table
CREATE TABLE IF NOT EXISTS validation_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  validation_form_id UUID NOT NULL REFERENCES validation_forms(id) ON DELETE CASCADE,
  market_analysis JSONB NOT NULL,
  business_model JSONB NOT NULL,
  team_strength JSONB NOT NULL,
  overall_assessment JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on validation_form_id
CREATE INDEX IF NOT EXISTS idx_validation_analyses_form_id ON validation_analyses(validation_form_id);

-- Add RLS policies
ALTER TABLE validation_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON validation_analyses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON validation_analyses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON validation_analyses
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON validation_analyses
  FOR DELETE USING (auth.role() = 'authenticated'); 