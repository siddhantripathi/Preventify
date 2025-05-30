import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { fetchPatientData } from '@/services/patients/patientDataService';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export const usePatientFetch = (
  setPatients: any, 
  setPrescriptions: any, 
  setDocuments: any, 
  setError: any, 
  setLoading: any
) => {
  const { user, registerActivity } = useAuth();
  const { toast } = useToast();

  // Define a function to fetch all data
  const refreshData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPatientData(user.id, registerActivity);
      setPatients(data.patients);
      setPrescriptions(data.prescriptions);
      setDocuments(data.documents);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to load patient data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, registerActivity, setPatients, setPrescriptions, setDocuments, setError, setLoading]);

  // Set up realtime subscriptions
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user) return () => {};

    // Enable more detailed logging for debugging
    console.log('Setting up Firebase realtime subscriptions');

    // Create listeners for Firestore collections
    const patientsUnsubscribe = onSnapshot(
      query(collection(db, 'patients')),
      (snapshot) => {
        console.log('Patient changes detected');
        refreshData();
      },
      (error) => {
        console.error('Error in patients subscription:', error);
      }
    );

    const prescriptionsUnsubscribe = onSnapshot(
      query(collection(db, 'prescriptions')),
      (snapshot) => {
        console.log('Prescription changes detected');
        refreshData();
      },
      (error) => {
        console.error('Error in prescriptions subscription:', error);
      }
    );

    const documentsUnsubscribe = onSnapshot(
      query(collection(db, 'patient_documents')),
      (snapshot) => {
        console.log('Document changes detected');
        refreshData();
      },
      (error) => {
        console.error('Error in documents subscription:', error);
      }
    );

    return () => {
      console.log('Cleaning up Firebase realtime subscriptions');
      patientsUnsubscribe();
      prescriptionsUnsubscribe();
      documentsUnsubscribe();
    };
  }, [user, refreshData]);

  return {
    refreshData,
    setupRealtimeSubscriptions
  };
};
