-- Create blood requests table
CREATE TABLE public.blood_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  blood_type TEXT NOT NULL,
  request_type TEXT NOT NULL DEFAULT 'normal', -- 'emergency' or 'normal'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'cancelled'
  donor_id UUID,
  scheduled_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hospital inventory table
CREATE TABLE public.hospital_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID NOT NULL,
  blood_type TEXT NOT NULL,
  units_available INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(hospital_id, blood_type)
);

-- Enable Row Level Security
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blood_requests
CREATE POLICY "Patients can view their own requests" 
ON public.blood_requests 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own requests" 
ON public.blood_requests 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own requests" 
ON public.blood_requests 
FOR UPDATE 
USING (auth.uid() = patient_id);

CREATE POLICY "Donors can view all pending requests" 
ON public.blood_requests 
FOR SELECT 
USING (status = 'pending' OR auth.uid() = donor_id);

CREATE POLICY "Donors can update requests they accept" 
ON public.blood_requests 
FOR UPDATE 
USING (auth.uid() = donor_id);

CREATE POLICY "Hospitals can view all requests" 
ON public.blood_requests 
FOR SELECT 
USING (true);

CREATE POLICY "Hospitals can update all requests" 
ON public.blood_requests 
FOR UPDATE 
USING (true);

-- RLS Policies for hospital_inventory
CREATE POLICY "Hospitals can manage their own inventory" 
ON public.hospital_inventory 
FOR ALL 
USING (auth.uid() = hospital_id);

CREATE POLICY "Everyone can view hospital inventory" 
ON public.hospital_inventory 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates on blood_requests
CREATE TRIGGER update_blood_requests_updated_at
BEFORE UPDATE ON public.blood_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample hospital inventory data
INSERT INTO public.hospital_inventory (hospital_id, blood_type, units_available) VALUES
('00000000-0000-0000-0000-000000000001', 'A+', 25),
('00000000-0000-0000-0000-000000000001', 'A-', 15),
('00000000-0000-0000-0000-000000000001', 'B+', 30),
('00000000-0000-0000-0000-000000000001', 'B-', 12),
('00000000-0000-0000-0000-000000000001', 'O+', 45),
('00000000-0000-0000-0000-000000000001', 'O-', 20),
('00000000-0000-0000-0000-000000000001', 'AB+', 18),
('00000000-0000-0000-0000-000000000001', 'AB-', 8);