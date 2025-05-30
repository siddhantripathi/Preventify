
import { useState } from 'react';
import { Patient, Prescription, PatientDocument } from '@/types';

export const usePatientState = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Computed values
  const queuedPatients = patients.filter(p => p.status !== 'completed');
  const completedPatients = patients.filter(p => p.status === 'completed');

  return {
    // State
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
    
    // Computed values
    queuedPatients,
    completedPatients
  };
};
