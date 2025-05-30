import { doc, setDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';
import { Patient } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { generatePatientId } from './patientUtils';

// Update addPatientToDb function to use Firebase
export const addPatientToDb = async (
  patientData: Partial<Patient>,
  userId: string,
  registerActivity: (action: string, resourceType: string, resourceId: string, details: string) => Promise<void>
) => {
  const patientId = uuidv4();
  const now = new Date();

  try {
    // Generate a unique patient UHID if not provided
    if (!patientData.uhid) {
      patientData.uhid = await generatePatientId();
    }
    
    // Create a new patient document in Firestore
    const patientRef = doc(collection(db, 'patients'), patientId);
    
    // Firestore doesn't accept undefined values, replace with null
    await setDoc(patientRef, {
      name: patientData.name || '',
      age: patientData.age || 0,
      gender: patientData.gender || 'male',
      uhid: patientData.uhid || '',
      mobile: patientData.mobile || '',
      locationid: patientData.locationId || '',
      doctorid: patientData.doctorId || null, // Use null instead of undefined
      visittag: patientData.visitTag || 'consultation',
      status: patientData.status || 'waiting',
      vitals: patientData.vitals || {
        hr: 0,
        bp: '',
        rr: 0,
        tp: 0,
        spo2: 0
      },
      complaints: patientData.complaints || '',
      history: patientData.history || '',
      doctor_notes: patientData.doctorNotes || '',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    await registerActivity('create', 'patient', patientId, `Added new patient: ${patientData.name}`);

    return {
      id: patientId,
      name: patientData.name || '',
      age: patientData.age || 0,
      gender: patientData.gender || 'male',
      uhid: patientData.uhid || '',
      mobile: patientData.mobile || '',
      locationId: patientData.locationId || '',
      doctorId: patientData.doctorId,
      visitTag: patientData.visitTag || 'consultation',
      vitals: patientData.vitals || {
        hr: 0,
        bp: '',
        rr: 0,
        tp: 0,
        spo2: 0
      },
      history: patientData.history || '',
      complaints: patientData.complaints || '',
      doctorNotes: patientData.doctorNotes || '',
      status: patientData.status || 'waiting',
      createdAt: now,
      updatedAt: now
    } as Patient;
  } catch (error) {
    console.error('Error saving patient to Firebase:', error);
    throw error;
  }
};

// Update updatePatientInDb function to use Firebase
export const updatePatientInDb = async (
  id: string,
  updates: Partial<Patient>,
  registerActivity: (action: string, resourceType: string, resourceId: string, details: string) => Promise<void>
) => {
  try {
    // Update patient document in Firestore
    const patientRef = doc(db, 'patients', id);
    
    // Prepare update data without undefined values
    const updateData = {
      name: updates.name || null,
      age: updates.age || null,
      gender: updates.gender || null,
      uhid: updates.uhid || null,
      mobile: updates.mobile || null,
      locationid: updates.locationId || null,
      doctorid: updates.doctorId || null,
      visittag: updates.visitTag || null,
      status: updates.status || null,
      vitals: updates.vitals || null,
      complaints: updates.complaints || null,
      history: updates.history || null,
      doctor_notes: updates.doctorNotes || null,
      updated_at: serverTimestamp()
    };
    
    // Remove null values (keep only defined fields)
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null) {
        delete updateData[key];
      }
    });
    
    await updateDoc(patientRef, updateData);

    await registerActivity('update', 'patient', id, `Updated patient information`);

    return true;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};
