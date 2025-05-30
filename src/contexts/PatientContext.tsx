
import React, { createContext, useContext } from 'react';
import { Patient, Prescription, PatientDocument } from '@/types';
import { usePatientData } from '@/hooks/usePatientData';

interface PatientContextType {
  patients: Patient[];
  queuedPatients: Patient[];
  completedPatients: Patient[];
  currentPatient: Patient | null;
  prescriptions: Prescription[];
  loading: boolean;
  error: Error | null;
  setCurrentPatient: (patient: Patient | null) => void;
  addPatient: (patientData: Partial<Patient>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<Patient | null>;
  updatePatientStatus: (id: string, status: 'waiting' | 'in-progress' | 'completed') => Promise<void>;
  getPatientDocuments: (patientId: string) => PatientDocument[];
  addDocumentToPatient: (patientId: string, document: Partial<PatientDocument>) => Promise<PatientDocument | null>;
  deletePatientDocument: (documentId: string) => Promise<void>;
  addPrescription: (prescriptionData: Partial<Prescription>) => Promise<Prescription | null>;
  getPrescriptionsForPatient: (patientId: string) => Prescription[];
  refreshData: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType>({
  patients: [],
  queuedPatients: [],
  completedPatients: [],
  currentPatient: null,
  prescriptions: [],
  loading: false,
  error: null,
  setCurrentPatient: () => {},
  addPatient: () => ({} as Patient),
  updatePatient: async () => null,
  updatePatientStatus: async () => {},
  getPatientDocuments: () => [],
  addDocumentToPatient: async () => null,
  deletePatientDocument: async () => {},
  addPrescription: async () => null,
  getPrescriptionsForPatient: () => [],
  refreshData: async () => {},
});

export const usePatient = () => useContext(PatientContext);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const patientData = usePatientData();
  
  return (
    <PatientContext.Provider value={patientData}>
      {children}
    </PatientContext.Provider>
  );
};
