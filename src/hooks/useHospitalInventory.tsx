import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface HospitalInventory {
  id: string;
  hospital_id: string;
  blood_type: string;
  units_available: number;
  last_updated: string;
}

export const useHospitalInventory = (hospitalId?: string) => {
  const [inventory, setInventory] = useState<HospitalInventory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('hospital_inventory')
        .select('*')
        .order('blood_type');

      if (hospitalId) {
        query = query.eq('hospital_id', hospitalId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching hospital inventory:', error);
        toast({
          title: "Error",
          description: "Failed to load hospital inventory",
          variant: "destructive",
        });
      } else {
        setInventory(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (bloodType: string, newUnits: number, hospitalId: string) => {
    try {
      const { error } = await supabase
        .from('hospital_inventory')
        .upsert({
          hospital_id: hospitalId,
          blood_type: bloodType,
          units_available: newUnits,
          last_updated: new Date().toISOString()
        }, {
          onConflict: 'hospital_id,blood_type'
        });

      if (error) {
        console.error('Error updating inventory:', error);
        toast({
          title: "Error",
          description: "Failed to update inventory",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Inventory Updated",
        description: `${bloodType} inventory updated to ${newUnits} units`,
      });

      fetchInventory();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const addInventory = async (bloodType: string, unitsToAdd: number, hospitalId: string) => {
    const currentInventory = inventory.find(item => 
      item.blood_type === bloodType && item.hospital_id === hospitalId
    );
    
    const currentUnits = currentInventory ? currentInventory.units_available : 0;
    const newUnits = currentUnits + unitsToAdd;
    
    return updateInventory(bloodType, newUnits, hospitalId);
  };

  const deductInventory = async (bloodType: string, unitsToDeduct: number, hospitalId: string) => {
    const currentInventory = inventory.find(item => 
      item.blood_type === bloodType && item.hospital_id === hospitalId
    );
    
    if (!currentInventory || currentInventory.units_available < unitsToDeduct) {
      toast({
        title: "Error",
        description: "Insufficient inventory for this blood type",
        variant: "destructive",
      });
      return false;
    }
    
    const newUnits = currentInventory.units_available - unitsToDeduct;
    return updateInventory(bloodType, newUnits, hospitalId);
  };

  useEffect(() => {
    fetchInventory();
  }, [hospitalId]);

  return {
    inventory,
    loading,
    fetchInventory,
    updateInventory,
    addInventory,
    deductInventory
  };
};