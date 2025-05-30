
import { useCallback } from 'react';
import { PatientDocument, Prescription } from '@/types';

export const usePatientQueries = (
  documents: PatientDocument[],
  prescriptions: Prescription[]
) => {
  // Get documents for a patient
  const getPatientDocuments = useCallback((patientId: string) => {
    return documents.filter(doc => doc.patientId === patientId);
  }, [documents]);

  // Get prescriptions for a patient
  const getPrescriptionsForPatient = useCallback((patientId: string) => {
    return prescriptions.filter(p => p.patientId === patientId);
  }, [prescriptions]);

  return {
    getPatientDocuments,
    getPrescriptionsForPatient
  };
};
