
import { useCallback } from 'react';
import { Patient } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { updatePatientInDb } from '@/services/patients/patientMutationService';

export const usePatientUpdateMutation = (
  patients: Patient[],
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>,
  setCurrentPatient: React.Dispatch<React.SetStateAction<Patient | null>>
) => {
  const { user, registerActivity } = useAuth();
  const { toast } = useToast();

  // Update a patient
  const updatePatient = useCallback(async (id: string, updates: Partial<Patient>) => {
    if (!user) return null;

    try {
      // Update local state first
      setPatients(prev => 
        prev.map(patient => 
          patient.id === id 
            ? { ...patient, ...updates, updatedAt: new Date() } 
            : patient
        )
      );

      setCurrentPatient(prev => prev?.id === id 
        ? { ...prev, ...updates, updatedAt: new Date() } 
        : prev
      );

      // Update in database
      await updatePatientInDb(id, updates, registerActivity);

      const updatedPatient = patients.find(p => p.id === id);
      if (updatedPatient) {
        return { ...updatedPatient, ...updates, updatedAt: new Date() };
      }
      return null;
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: 'Error',
        description: 'Failed to update patient data. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, registerActivity, toast, patients, setPatients, setCurrentPatient]);

  // Update patient status
  const updatePatientStatus = useCallback(async (id: string, status: 'waiting' | 'in-progress' | 'completed') => {
    await updatePatient(id, { status });
  }, [updatePatient]);

  return { updatePatient, updatePatientStatus };
};
