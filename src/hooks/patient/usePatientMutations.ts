
import { Patient, PatientDocument, Prescription } from '@/types';
import { usePatientAddMutation } from './mutations/usePatientAddMutation';
import { usePatientUpdateMutation } from './mutations/usePatientUpdateMutation';
import { useDocumentMutation } from './mutations/useDocumentMutation';
import { usePrescriptionMutation } from './mutations/usePrescriptionMutation';

export const usePatientMutations = (
  patients: Patient[],
  documents: PatientDocument[],
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>, 
  setDocuments: React.Dispatch<React.SetStateAction<PatientDocument[]>>,
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>,
  setCurrentPatient: React.Dispatch<React.SetStateAction<Patient | null>>
) => {
  // Use specialized hooks
  const { addPatient } = usePatientAddMutation(setPatients);
  
  const { updatePatient, updatePatientStatus } = usePatientUpdateMutation(
    patients,
    setPatients, 
    setCurrentPatient
  );
  
  const { addDocumentToPatient, deletePatientDocument } = useDocumentMutation(
    documents,
    setDocuments
  );
  
  const { addPrescription } = usePrescriptionMutation(
    patients,
    setPrescriptions,
    updatePatientStatus
  );

  return {
    addPatient,
    updatePatient,
    updatePatientStatus,
    addDocumentToPatient,
    deletePatientDocument,
    addPrescription
  };
};
