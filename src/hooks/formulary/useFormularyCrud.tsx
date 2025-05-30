
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Medication, Salt, Brand } from '@/types/formulary';
import { useToast } from '@/components/ui/use-toast';
import { useActivityLogger } from '../useActivityLogger';
import { useAuth } from '@/contexts/AuthContext';

export const useFormularyCrud = (refreshData: () => Promise<void>) => {
  const { toast } = useToast();
  const { registerActivity } = useActivityLogger();
  const { user } = useAuth();

  const addMedication = useCallback(async (genericName: string, saltId: string | null): Promise<Medication | null> => {
    try {
      const finalSaltId = saltId === "none" ? null : saltId;
      
      const { data, error } = await supabase
        .from('medications')
        .insert({ generic_name: genericName, salt_id: finalSaltId })
        .select()
        .single();

      if (error) throw error;

      const medication: Medication = {
        id: data.id,
        generic_name: data.generic_name,
        salt_id: data.salt_id,
        created_at: data.created_at ? new Date(data.created_at) : new Date()
      };

      registerActivity(
        user?.id,
        'create',
        'formulary',
        medication.id,
        `Added medication: ${genericName}`
      );

      refreshData();
      toast({
        title: "Medication added",
        description: `${genericName} has been added to the formulary.`,
      });

      return medication;
    } catch (err: any) {
      toast({
        title: "Failed to add medication",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  }, [refreshData, registerActivity, toast, user?.id]);

  const addSalt = useCallback(async (saltName: string): Promise<Salt | null> => {
    try {
      const { data, error } = await supabase
        .from('salts')
        .insert({ salt_name: saltName })
        .select()
        .single();

      if (error) throw error;

      const salt: Salt = {
        id: data.id,
        salt_name: data.salt_name,
        created_at: data.created_at ? new Date(data.created_at) : new Date()
      };

      registerActivity(
        user?.id,
        'create',
        'formulary',
        salt.id,
        `Added salt: ${saltName}`
      );

      refreshData();
      toast({
        title: "Salt added",
        description: `${saltName} has been added to the formulary.`,
      });

      return salt;
    } catch (err: any) {
      toast({
        title: "Failed to add salt",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  }, [refreshData, registerActivity, toast, user?.id]);

  const addBrand = useCallback(async (brandName: string, medicationId: string): Promise<Brand | null> => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({ brand_name: brandName, medication_id: medicationId })
        .select()
        .single();

      if (error) throw error;

      const brand: Brand = {
        id: data.id,
        brand_name: data.brand_name,
        medication_id: data.medication_id,
        created_at: data.created_at ? new Date(data.created_at) : new Date()
      };

      registerActivity(
        user?.id,
        'create',
        'formulary',
        brand.id,
        `Added brand: ${brandName}`
      );

      refreshData();
      toast({
        title: "Brand added",
        description: `${brandName} has been added to the formulary.`,
      });

      return brand;
    } catch (err: any) {
      toast({
        title: "Failed to add brand",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  }, [refreshData, registerActivity, toast, user?.id]);

  return { addMedication, addSalt, addBrand };
};
