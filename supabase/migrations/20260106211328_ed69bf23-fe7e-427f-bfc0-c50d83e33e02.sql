-- Drop restrictive RLS policies and create public ones for coordinators
DROP POLICY IF EXISTS "Authenticated users can view coordinators" ON public.coordinators;
DROP POLICY IF EXISTS "Authenticated users can insert coordinators" ON public.coordinators;
DROP POLICY IF EXISTS "Authenticated users can update coordinators" ON public.coordinators;
DROP POLICY IF EXISTS "Authenticated users can delete coordinators" ON public.coordinators;

-- Create public access policies
CREATE POLICY "Allow all access to coordinators" 
ON public.coordinators 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Re-insert the seed data since table might be empty
INSERT INTO public.coordinators (name, phone) VALUES
  ('Aniket', '8830707410'),
  ('Manasi', '9834315136'),
  ('Bajrang', '9767218631'),
  ('Rushikesh', '9579190558'),
  ('Priya', '9106250602'),
  ('Parashuram', '8600766743')
ON CONFLICT DO NOTHING;