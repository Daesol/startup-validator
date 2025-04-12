-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.validation_analyses;
DROP POLICY IF EXISTS "Allow all users to read validation forms" ON public.validation_forms;
DROP POLICY IF EXISTS "Allow all users to insert validation forms" ON public.validation_forms;
DROP POLICY IF EXISTS "Allow all users to update validation forms" ON public.validation_forms;
DROP POLICY IF EXISTS "Allow all users to delete validation forms" ON public.validation_forms;

-- Enable RLS on all tables if not already enabled
ALTER TABLE public.validation_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for validation_forms
CREATE POLICY "Allow public read access to validation_forms"
ON public.validation_forms
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access to validation_forms"
ON public.validation_forms
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access to validation_forms"
ON public.validation_forms
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete access to validation_forms"
ON public.validation_forms
FOR DELETE
TO public
USING (true);

-- Create policies for validation_analyses
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

CREATE POLICY "Allow public delete access to validation_analyses"
ON public.validation_analyses
FOR DELETE
TO public
USING (true);

-- Create policies for team_members
CREATE POLICY "Allow public read access to team_members"
ON public.team_members
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access to team_members"
ON public.team_members
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access to team_members"
ON public.team_members
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete access to team_members"
ON public.team_members
FOR DELETE
TO public
USING (true); 