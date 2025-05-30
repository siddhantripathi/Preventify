import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';
import { Prescription } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const addPrescriptionToDb = async (
  prescriptionData: Partial<Prescription>,
  userId: string,
  registerActivity: (action: string, resourceType: string, resourceId: string, details: string) => Promise<void>
) => {
  try {
    const prescriptionId = uuidv4();
    const now = new Date();

    // Create a new prescription document in Firestore
    const prescriptionRef = doc(collection(db, 'prescriptions'), prescriptionId);
    
    await setDoc(prescriptionRef, {
      patient_id: prescriptionData.patientId || '',
      doctor_id: userId,
      location_id: prescriptionData.locationId || '',
      diagnoses: prescriptionData.diagnoses || [],
      medications: prescriptionData.medications || [],
      advice: prescriptionData.advice || [],
      follow_up: prescriptionData.followUp || '',
      workup_notes: prescriptionData.workupNotes || {},
      workup_parameters: prescriptionData.workupParameters || [],
      clinical_assessment: prescriptionData.clinicalAssessment || '',
      created_at: serverTimestamp()
    });

    await registerActivity('create', 'prescription', prescriptionId, `Created prescription for patient ${prescriptionData.patientId}`);

    // Return the full prescription object for the frontend with all the fields from our type
    return {
      id: prescriptionId,
      patientId: prescriptionData.patientId || '',
      doctorId: userId,
      locationId: prescriptionData.locationId || '',
      diagnoses: prescriptionData.diagnoses || [],
      medications: prescriptionData.medications || [],
      advice: prescriptionData.advice || [],
      followUp: prescriptionData.followUp || '',
      workupNotes: prescriptionData.workupNotes || {},
      workupParameters: prescriptionData.workupParameters || [],
      clinicalAssessment: prescriptionData.clinicalAssessment || '',
      createdAt: now
    } as Prescription;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};
