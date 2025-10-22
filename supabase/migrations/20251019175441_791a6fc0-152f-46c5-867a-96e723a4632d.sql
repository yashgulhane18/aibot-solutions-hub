-- Add comparison_enabled field to agents table
ALTER TABLE public.agents 
ADD COLUMN comparison_enabled boolean DEFAULT false;