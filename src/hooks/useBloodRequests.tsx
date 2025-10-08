import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface BloodRequest {
  id: string;
  patient_id: string;
  blood_type: string;
  request_type: string;
  status: string;
  donor_id?: string;
  scheduled_date?: string;
  notes?: string;
  up_to_date?: string;
  created_at: string;
  updated_at: string;
}

export const useBloodRequests = () => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPatientRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patient requests:', error);
        toast({
          title: "Error",
          description: "Failed to load your requests",
          variant: "destructive",
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonorRequests = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First, get the donor's blood group from their profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('blood_group')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching donor profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to load your profile",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const donorBloodGroup = profileData?.blood_group;

      // Fetch requests matching donor's blood group
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .in('status', ['pending', 'accepted'])
        .eq('blood_type', donorBloodGroup)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donor requests:', error);
        toast({
          title: "Error",
          description: "Failed to load blood requests",
          variant: "destructive",
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all requests:', error);
        toast({
          title: "Error",
          description: "Failed to load requests",
          variant: "destructive",
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId: string, scheduledDate: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({
          status: 'accepted',
          donor_id: user.id,
          scheduled_date: scheduledDate
        })
        .eq('id', requestId);

      if (error) {
        console.error('Error accepting request:', error);
        toast({
          title: "Error",
          description: "Failed to accept request",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Request Accepted",
        description: "You have successfully accepted the blood request.",
      });

      // Refresh the requests
      fetchDonorRequests();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const completeRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      if (error) {
        console.error('Error completing request:', error);
        toast({
          title: "Error",
          description: "Failed to complete request",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Request Completed",
        description: "Blood donation completed successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const cancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      if (error) {
        console.error('Error cancelling request:', error);
        toast({
          title: "Error",
          description: "Failed to cancel request",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Request Cancelled",
        description: "Blood request cancelled successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return {
    requests,
    loading,
    fetchPatientRequests,
    fetchDonorRequests,
    fetchAllRequests,
    acceptRequest,
    completeRequest,
    cancelRequest
  };
};