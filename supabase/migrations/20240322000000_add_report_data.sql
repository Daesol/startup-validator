-- Add report_data JSONB field to validation_analyses table
ALTER TABLE public.validation_analyses ADD COLUMN IF NOT EXISTS report_data JSONB;

-- Create index for improved query performance
CREATE INDEX IF NOT EXISTS validation_analyses_report_data_idx ON public.validation_analyses USING GIN (report_data);

-- Update policies to allow access to the new field
DROP POLICY IF EXISTS "Allow public read access to validation_analyses" ON public.validation_analyses;
DROP POLICY IF EXISTS "Allow public insert access to validation_analyses" ON public.validation_analyses;
DROP POLICY IF EXISTS "Allow public update access to validation_analyses" ON public.validation_analyses;

-- Recreate the policies with the new field
CREATE POLICY "Allow public read access to validation_analyses"
ON public.validation_analyses
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access to validation_analyses"
ON public.validation_analyses
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access to validation_analyses"
ON public.validation_analyses
FOR UPDATE
TO public
USING (true)
WITH CHECK (true); 