-- Create storage bucket for registration forms
INSERT INTO storage.buckets (id, name, public)
VALUES ('registration-forms', 'registration-forms', true);

-- Allow public read access to registration forms
CREATE POLICY "Public can view registration forms"
ON storage.objects FOR SELECT
USING (bucket_id = 'registration-forms');

-- Allow authenticated and anonymous users to upload registration forms
CREATE POLICY "Anyone can upload registration forms"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'registration-forms');

-- Allow updates to registration forms
CREATE POLICY "Anyone can update registration forms"
ON storage.objects FOR UPDATE
USING (bucket_id = 'registration-forms');

-- Allow deletes of registration forms
CREATE POLICY "Anyone can delete registration forms"
ON storage.objects FOR DELETE
USING (bucket_id = 'registration-forms');

-- Add registration_form_url column to companies table
ALTER TABLE public.companies
ADD COLUMN registration_form_url text;