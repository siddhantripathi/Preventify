
import { useEffect } from 'react';
import { usePatientState } from './patient/usePatientState';
import { usePatientFetch } from './patient/usePatientFetch';
import { usePatientMutations } from './patient/usePatientMutations';
import { usePatientQueries } from './patient/usePatientQueries';

export const usePatientData = () => {
  const {
    patients,
    setPatients,
    prescriptions, 
    setPrescriptions,
    documents,
    setDocuments,
    currentPatient,
    setCurrentPatient,
    loading,
    setLoading,
    error,
    setError,
    queuedPatients,
    completedPatients
  } = usePatientState();

  const { refreshData, setupRealtimeSubscriptions } = usePatientFetch(
    setPatients,
    setPrescriptions,
    setDocuments,
    setError,
    setLoading
  );

  const {
    addPatient,
    updatePatient,
    updatePatientStatus,
    addDocumentToPatient,
    deletePatientDocument,
    addPrescription
  } = usePatientMutations(
    patients,
    documents,
    setPatients,
    setDocuments,
    setPrescriptions,
    setCurrentPatient
  );

  const {
    getPatientDocuments,
    getPrescriptionsForPatient
  } = usePatientQueries(documents, prescriptions);

  // Load data when the component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Set up realtime subscriptions
  useEffect(() => {
    const cleanup = setupRealtimeSubscriptions();
    return cleanup;
  }, [setupRealtimeSubscriptions]);

  return {
    // State
    patients,
    prescriptions,
    currentPatient,
    loading,
    error,
    
    // Computed values
    queuedPatients,
    completedPatients,
    
    // Methods for state management
    setCurrentPatient,
    
    // Methods for data fetching
    refreshData,
    
    // Methods for mutations
    addPatient,
    updatePatient,
    updatePatientStatus,
    addDocumentToPatient,
    deletePatientDocument,
    addPrescription,
    
    // Query methods
    getPatientDocuments,
    getPrescriptionsForPatient
  };
};
