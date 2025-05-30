
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormularyMedication, Salt, Brand } from '@/types/formulary';
import { useToast } from '@/components/ui/use-toast';

export const useFormularyData = () => {
  const [medications, setMedications] = useState<FormularyMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchFormularyData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch medications with their salts
      const { data: medicationsData, error: medsError } = await supabase
        .from('medications')
        .select(`
          id,
          generic_name,
          salt_id,
          created_at,
          salts(id, salt_name)
        `);

      if (medsError) throw medsError;

      // Fetch brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('*');

      if (brandsError) throw brandsError;

      // Process and organize the data
      const processedMedications: FormularyMedication[] = medicationsData.map((med: any) => {
        const salt = med.salts ? {
          id: med.salts.id,
          salt_name: med.salts.salt_name,
          created_at: med.salts.created_at ? new Date(med.salts.created_at) : new Date()
        } as Salt : undefined;

        const medicationBrands = brandsData
          .filter((brand: any) => brand.medication_id === med.id)
          .map((brand: any) => ({
            id: brand.id,
            brand_name: brand.brand_name,
            medication_id: brand.medication_id,
            created_at: brand.created_at ? new Date(brand.created_at) : new Date()
          })) as Brand[];

        return {
          id: med.id,
          generic_name: med.generic_name,
          salt_id: med.salt_id,
          created_at: med.created_at ? new Date(med.created_at) : new Date(),
          salt,
          brands: medicationBrands
        };
      });

      setMedications(processedMedications);
      console.log('Formulary data loaded:', processedMedications);
    } catch (err: any) {
      console.error('Error fetching formulary data:', err);
      setError(err);
      toast({
        title: "Failed to load formulary data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchFormularyData();
  }, [fetchFormularyData]);

  return { medications, loading, error, refresh: fetchFormularyData };
};
