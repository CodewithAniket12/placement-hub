-- Create blocked_dates table for admin to block date ranges
CREATE TABLE public.blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create date_requests table for coordinators to request dates
CREATE TABLE public.date_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  requested_date DATE NOT NULL,
  coordinator_name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.date_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for blocked_dates (everyone can view, only admins can modify)
CREATE POLICY "Anyone can view blocked dates"
ON public.blocked_dates FOR SELECT
USING (true);

CREATE POLICY "Admins can manage blocked dates"
ON public.blocked_dates FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS policies for date_requests
CREATE POLICY "Approved users can view date requests"
ON public.date_requests FOR SELECT
USING (public.is_approved(auth.uid()));

CREATE POLICY "Approved users can create date requests"
ON public.date_requests FOR INSERT
WITH CHECK (public.is_approved(auth.uid()));

CREATE POLICY "Admins can update date requests"
ON public.date_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_blocked_dates_updated_at
BEFORE UPDATE ON public.blocked_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_date_requests_updated_at
BEFORE UPDATE ON public.date_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();