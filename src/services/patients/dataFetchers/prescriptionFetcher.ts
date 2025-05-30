import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';
import { Prescription } from '@/types';

export const fetchPrescriptions = async (): Promise<Prescription[]> => {
  try {
    // Create a query to fetch prescriptions ordered by creation date
    const prescriptionsQuery = query(collection(db, 'prescriptions'), orderBy('created_at', 'desc'));
    
    // Fetch prescriptions from Firestore
    const querySnapshot = await getDocs(prescriptionsQuery);
    
    // Process prescriptions
    const prescriptions: Prescription[] = [];
    querySnapshot.forEach((doc) => {
      const prescriptionData = doc.data();
      
      prescriptions.push({
        id: doc.id,
        patientId: prescriptionData.patient_id,
        doctorId: prescriptionData.doctor_id,
        locationId: prescriptionData.location_id,
        diagnoses: prescriptionData.diagnoses || [],
        medications: prescriptionData.medications || [],
        advice: prescriptionData.advice || [],
        followUp: prescriptionData.follow_up,
        workupNotes: prescriptionData.workup_notes,
        workupParameters: prescriptionData.workup_parameters || [],
        clinicalAssessment: prescriptionData.clinical_assessment,
        createdAt: prescriptionData.created_at?.toDate() || new Date(),
      } as Prescription);
    });
    
    return prescriptions;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
};
