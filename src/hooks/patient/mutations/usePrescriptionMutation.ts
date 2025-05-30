
import { useCallback } from 'react';
import { Patient, Prescription } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { addPrescriptionToDb } from '@/services/patients/patientPrescriptionService';

export const usePrescriptionMutation = (
  patients: Patient[],
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>,
  updatePatientStatus: (id: string, status: 'waiting' | 'in-progress' | 'completed') => Promise<void>
) => {
  const { user, registerActivity } = useAuth();
  const { toast } = useToast();

  // Add prescription
  const addPrescription = useCallback(async (prescriptionData: Partial<Prescription>) => {
    if (!user) return null;

    try {
      const newPrescription = await addPrescriptionToDb(prescriptionData, user.id, registerActivity);
      
      // Update local state
      setPrescriptions(prev => [newPrescription, ...prev]);

      // Mark patient as completed if not already
      const patient = patients.find(p => p.id === newPrescription.patientId);
      if (patient && patient.status !== 'completed') {
        updatePatientStatus(patient.id, 'completed');
      }

      toast({
        title: 'Prescription Created',
        description: 'The prescription has been created and saved.'
      });

      return newPrescription;
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to create prescription. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, registerActivity, patients, updatePatientStatus, toast, setPrescriptions]);

  return { addPrescription };
};
