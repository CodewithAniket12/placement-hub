-- Create coordinators table to store POC names and contact info
CREATE TABLE public.coordinators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coordinators ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated access (not public)
CREATE POLICY "Authenticated users can view coordinators"
ON public.coordinators
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert coordinators"
ON public.coordinators
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update coordinators"
ON public.coordinators
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete coordinators"
ON public.coordinators
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Insert the 6 default coordinators
INSERT INTO public.coordinators (name, phone) VALUES
  ('Aniket', '8830707410'),
  ('Manasi', '9834315136'),
  ('Bajrang', '9767218631'),
  ('Rushikesh', '9579190558'),
  ('Priya', '9106250602'),
  ('Parshuram', '8600766743');