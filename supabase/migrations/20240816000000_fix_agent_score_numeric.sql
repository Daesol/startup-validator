-- Fix for the score column type in vc_agent_analyses
ALTER TABLE public.vc_agent_analyses ALTER COLUMN score TYPE NUMERIC; 