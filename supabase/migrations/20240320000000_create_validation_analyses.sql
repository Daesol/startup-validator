-- Create the validation_analyses table
CREATE TABLE IF NOT EXISTS public.validation_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    validation_form_id UUID REFERENCES public.validation_forms(id) ON DELETE CASCADE,
    market_analysis JSONB,
    business_model JSONB,
    team_strength JSONB,
    overall_assessment JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS validation_analyses_validation_form_id_idx ON public.validation_analyses(validation_form_id);

-- Enable RLS
ALTER TABLE public.validation_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for now (we can restrict this later if needed)
CREATE POLICY "Enable all operations for all users" ON public.validation_analyses
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.validation_analyses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 