import { useCallback } from 'react';
import { Patient } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { addPatientToDb } from '@/services/patients/patientMutationService';

export const usePatientAddMutation = (
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
) => {
  const { user, registerActivity } = useAuth();
  const { toast } = useToast();

  // Add a new patient
  const addPatient = useCallback((patientData: Partial<Patient>) => {
    if (!user) throw new Error('User not authenticated');

    const patientId = patientData.id || crypto.randomUUID();
    const now = new Date();

    // Create new patient object with defaults
    const newPatient: Patient = {
      id: patientId,
      name: patientData.name || '',
      age: patientData.age || 0,
      gender: patientData.gender || 'male',
      uhid: patientData.uhid || `P${Math.floor(Math.random() * 10000)}`,
      locationId: patientData.locationId || '',
      doctorId: patientData.doctorId,
      visitTag: patientData.visitTag || 'consultation',
      vitals: patientData.vitals || {
        hr: 0,
        bp: '',
        rr: 0,
        tp: 0,
        spo2: 0
      },
      history: patientData.history || '',
      complaints: patientData.complaints || '',
      status: patientData.status || 'waiting',
      createdAt: now,
      updatedAt: now,
      mobile: patientData.mobile || ''
    };

    // Add to local state first for immediate UI update
    setPatients(prev => [newPatient, ...prev]);

    // Save to Firebase in the background
    (async () => {
      try {
        console.log("Adding patient to database:", newPatient);
        await addPatientToDb(newPatient, user.id, registerActivity);
        
        toast({
          title: 'Patient Added',
          description: `${newPatient.name} has been added to the queue.`
        });
      } catch (error) {
        console.error('Error saving patient to Firebase:', error);
        // Remove from local state if save failed
        setPatients(prev => prev.filter(p => p.id !== patientId));
        
        toast({
          title: 'Error',
          description: 'Failed to save patient data. Please try again.',
          variant: 'destructive'
        });
      }
    })();

    return newPatient;
  }, [user, registerActivity, toast, setPatients]);

  return { addPatient };
};
