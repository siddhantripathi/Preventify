
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Doctor {
  id: string;
  name: string;
  specialization?: string;
}

export function useDoctors(locationId?: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        
        // First get all users with 'doctor' role
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('users')
          .select('id, name, specialization')
          .eq('role', 'doctor');
          
        if (doctorsError) {
          throw doctorsError;
        }

        // If locationId is provided, filter doctors by location
        if (locationId) {
          const { data: locationUsers, error: locationError } = await supabase
            .from('user_locations')
            .select('user_id')
            .eq('location_id', locationId);
            
          if (locationError) {
            console.warn('Error fetching location users:', locationError);
            // Continue with all doctors if location filtering fails
          } else if (locationUsers && locationUsers.length > 0) {
            // Filter doctors to only those assigned to this location
            const locationUserIds = locationUsers.map(item => item.user_id);
            const filteredDoctors = doctorsData.filter(doctor => 
              locationUserIds.includes(doctor.id)
            );
            
            setDoctors(filteredDoctors);
            setLoading(false);
            return;
          }
        }
        
        // If no location filtering or location filtering failed, return all doctors
        setDoctors(doctorsData);
      } catch (err: any) {
        console.error('Error fetching doctors:', err);
        setError(err);
        toast({
          title: 'Error',
          description: 'Failed to load doctors. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, [locationId, toast]);

  return { doctors, loading, error };
}
