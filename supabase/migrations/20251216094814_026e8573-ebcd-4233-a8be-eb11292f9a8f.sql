-- Create companies table with 1st and 2nd POC and notes
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Blacklisted')),
  registration_status TEXT NOT NULL DEFAULT 'Pending' CHECK (registration_status IN ('Submitted', 'Pending')),
  poc_1st TEXT NOT NULL,
  poc_2nd TEXT,
  hr_name TEXT,
  hr_phone TEXT,
  hr_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Create policy for all access (since this is internal tool without auth)
CREATE POLICY "Allow all access to companies" 
ON public.companies 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();