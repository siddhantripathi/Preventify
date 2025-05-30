import { collection, query, getDocs, limit } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/integrations/firebase/config';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get file URL from Firebase Storage
export const getFileUrl = async (bucket: string, path: string) => {
  const fileRef = ref(storage, `${bucket}/${path}`);
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};

// Helper function to convert base64 to Blob
export const base64ToBlob = (base64: string, contentType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};

// Function to generate a unique patient ID with PF prefix and 4 digits
export const generatePatientId = async (): Promise<string> => {
  try {
    // Query the patients collection to get the count
    const patientsQuery = query(collection(db, 'patients'));
    const querySnapshot = await getDocs(patientsQuery);
    
    // Get the count of documents
    const count = querySnapshot.size;
    
    // Start with 1 or use count + 1
    let nextNumber = count + 1;
    
    // Ensure 4 digits with leading zeros
    let formattedNumber = nextNumber.toString().padStart(4, '0');
    
    // Create the patient ID with PF prefix
    const patientId = `PF${formattedNumber}`;
    
    return patientId;
  } catch (error) {
    console.error('Error generating patient ID:', error);
    // Fallback to a random number if the operation fails
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `PF${randomNum}`;
  }
};
