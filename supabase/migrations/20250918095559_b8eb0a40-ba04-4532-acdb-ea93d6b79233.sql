-- Add upToDate field to blood_requests table
ALTER TABLE public.blood_requests 
ADD COLUMN up_to_date DATE;