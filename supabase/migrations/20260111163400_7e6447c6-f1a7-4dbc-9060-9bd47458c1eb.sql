-- 1. MULTIPLE HR CONTACTS TABLE
CREATE TABLE public.company_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  designation TEXT,
  phone TEXT,
  email TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to company_contacts" 
ON public.company_contacts 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE TRIGGER update_company_contacts_updated_at
BEFORE UPDATE ON public.company_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_company_contacts_company ON public.company_contacts(company_id);

-- 2. CAMPUS DRIVES TABLE
CREATE TABLE public.campus_drives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  drive_date DATE NOT NULL,
  drive_time TIME,
  venue TEXT,
  coordinator_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  eligible_branches TEXT,
  min_cgpa DECIMAL(3,2),
  registered_count INTEGER DEFAULT 0,
  appeared_count INTEGER DEFAULT 0,
  selected_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campus_drives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to campus_drives" 
ON public.campus_drives 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE TRIGGER update_campus_drives_updated_at
BEFORE UPDATE ON public.campus_drives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_campus_drives_company ON public.campus_drives(company_id);
CREATE INDEX idx_campus_drives_date ON public.campus_drives(drive_date);
CREATE INDEX idx_campus_drives_status ON public.campus_drives(status);

-- 3. ACTIVITY LOG TABLE
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('company', 'task', 'email', 'drive', 'contact')),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'status_changed', 'email_sent', 'note_added')),
  coordinator_name TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to activity_logs" 
ON public.activity_logs 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE INDEX idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_coordinator ON public.activity_logs(coordinator_name);