-- Add team_members column to validation_forms table
ALTER TABLE validation_forms
ADD COLUMN team_members JSONB DEFAULT '[]'::jsonb;

-- Create an index on the team_members column for better query performance
CREATE INDEX idx_validation_forms_team_members ON validation_forms USING GIN (team_members);

-- Add RLS policies for the team_members column
ALTER TABLE validation_forms ENABLE ROW LEVEL SECURITY;

-- Allow all users to read validation forms
CREATE POLICY "Allow all users to read validation forms"
ON validation_forms
FOR SELECT
TO public
USING (true);

-- Allow all users to insert validation forms
CREATE POLICY "Allow all users to insert validation forms"
ON validation_forms
FOR INSERT
TO public
WITH CHECK (true);

-- Allow all users to update validation forms
CREATE POLICY "Allow all users to update validation forms"
ON validation_forms
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow all users to delete validation forms
CREATE POLICY "Allow all users to delete validation forms"
ON validation_forms
FOR DELETE
TO public
USING (true); 