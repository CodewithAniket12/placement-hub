-- Add columns for extracted registration form data
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS job_roles TEXT,
ADD COLUMN IF NOT EXISTS package_offered TEXT,
ADD COLUMN IF NOT EXISTS eligibility_criteria TEXT,
ADD COLUMN IF NOT EXISTS bond_details TEXT,
ADD COLUMN IF NOT EXISTS job_location TEXT,
ADD COLUMN IF NOT EXISTS selection_process TEXT;

-- Drop the registration_form_url column as we won't store the file
ALTER TABLE public.companies DROP COLUMN IF EXISTS registration_form_url;