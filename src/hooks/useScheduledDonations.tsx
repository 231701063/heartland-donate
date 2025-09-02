import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ScheduledDonation {
  id: string;
  scheduled_date: string;
  status: string;
  created_at: string;
}

export const useScheduledDonations = () => {
  const [donations, setDonations] = useState<ScheduledDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDonations = async () => {
    if (!user) {
      setDonations([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('scheduled_donations')
        .select('id, scheduled_date, status, created_at')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .order('scheduled_date', { ascending: true });

      if (error) {
        throw error;
      }

      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching scheduled donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [user]);

  return {
    donations,
    loading,
    refetch: fetchDonations
  };
};