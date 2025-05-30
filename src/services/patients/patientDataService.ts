
import { Patient, Prescription, PatientDocument } from '@/types';
import { fetchPatients } from './dataFetchers/patientFetcher';
import { fetchPrescriptions } from './dataFetchers/prescriptionFetcher';
import { fetchPatientDocuments } from './dataFetchers/documentFetcher';

export const fetchPatientData = async (userId: string, registerActivity: (action: string, resourceType: string, resourceId: string, details: string) => Promise<void>) => {
  try {
    // Fetch all data in parallel for better performance
    const [patients, prescriptions, documents] = await Promise.all([
      fetchPatients(),
      fetchPrescriptions(),
      fetchPatientDocuments()
    ]);
    
    await registerActivity('view', 'patient', 'all', 'Loaded patient data');

    return {
      patients,
      prescriptions,
      documents
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
