import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';
import { Patient } from '@/types';

export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    // Create a query to fetch patients ordered by creation date
    const patientsQuery = query(collection(db, 'patients'), orderBy('created_at', 'desc'));
    
    // Fetch patients from Firestore
    const querySnapshot = await getDocs(patientsQuery);
    
    // Process patients
    const patients: Patient[] = [];
    querySnapshot.forEach((doc) => {
      const patientData = doc.data();
      
      // Use the vitals directly from Firestore
      const patientVitals = patientData.vitals || {
        hr: 0,
        bp: '',
        rr: 0,
        tp: 0,
        spo2: 0,
        weight: undefined,
        height: undefined
      };

      patients.push({
        id: doc.id,
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        uhid: patientData.uhid,
        mobile: patientData.mobile || '',
        locationId: patientData.locationid,
        doctorId: patientData.doctorid,
        visitTag: patientData.visittag,
        vitals: patientVitals,
        history: patientData.history || '',
        complaints: patientData.complaints || '',
        doctorNotes: patientData.doctor_notes || '',
        status: patientData.status || 'waiting',
        createdAt: patientData.created_at?.toDate() || new Date(),
        updatedAt: patientData.updated_at?.toDate() || new Date()
      } as Patient);
    });
    
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};
