
import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useActivityLogger } from '../useActivityLogger';
import { useAuth } from '@/contexts/AuthContext';
import { useFormularyCrud } from './useFormularyCrud';

export const useFormularyCsv = (refreshData: () => Promise<void>) => {
  const { toast } = useToast();
  const { registerActivity } = useActivityLogger();
  const { user } = useAuth();
  const { addSalt, addMedication, addBrand } = useFormularyCrud(refreshData);

  const handleCSVUpload = useCallback(async (data: { salt: string; brand: string }[]): Promise<void> => {
    try {
      let successCount = 0;
      let errorCount = 0;
      
      for (const item of data) {
        try {
          // First, try to find if the salt already exists
          const salt = await addSalt(item.salt);
          if (!salt) throw new Error(`Failed to add salt: ${item.salt}`);
          
          // Create generic medication with this salt
          const genericName = `Generic ${item.salt}`;
          const medication = await addMedication(genericName, salt.id);
          if (!medication) throw new Error(`Failed to add medication for salt: ${item.salt}`);
          
          // Add the brand
          const brand = await addBrand(item.brand, medication.id);
          if (!brand) throw new Error(`Failed to add brand: ${item.brand}`);
          
          successCount++;
        } catch (error) {
          console.error(`Error processing item: ${JSON.stringify(item)}`, error);
          errorCount++;
        }
      }
      
      registerActivity(
        user?.id,
        'create',
        'formulary',
        'bulk-upload',
        `CSV upload: ${successCount} items added, ${errorCount} failures`
      );

      refreshData();
      
      if (errorCount > 0) {
        toast({
          title: "CSV Upload Partially Completed",
          description: `Added ${successCount} items with ${errorCount} failures.`,
          variant: "default"
        });
      } else {
        toast({
          title: "CSV Upload Completed",
          description: `Successfully added all ${successCount} items from the CSV.`,
          variant: "default"
        });
      }
    } catch (err: any) {
      console.error('Error handling CSV upload:', err);
      toast({
        title: "CSV Upload Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  }, [addBrand, addMedication, addSalt, refreshData, registerActivity, toast, user?.id]);

  return { handleCSVUpload };
};
