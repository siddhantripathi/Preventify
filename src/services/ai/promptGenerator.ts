
import { Patient } from '@/types';

export const generatePromptFromPatient = (patient: Patient): string => {
  return `
Patient: ${patient.age}y ${patient.gender}, Complaints: ${patient.complaints || 'None'}
History: ${patient.history || 'None'}
Vitals: HR=${patient.vitals.hr}, BP=${patient.vitals.bp}, RR=${patient.vitals.rr}, Temp=${patient.vitals.tp}°C, SpO2=${patient.vitals.spo2}%
Notes: ${patient.doctorNotes || 'None'}

Based on this information, provide the TOP 5 most likely diagnoses with probabilities and treatment plans.

Provide concise JSON:
{
  "diagnoses": [
    {"name":"Diagnosis 1","probability":0.7,"icdCode":"X00.0","workup":["Test 1","Test 2"],"summary":"Brief explanation"},
    {"name":"Diagnosis 2","probability":0.5,"icdCode":"X00.0","workup":["Test 1","Test 2"],"summary":"Brief explanation"},
    {"name":"Diagnosis 3","probability":0.3,"icdCode":"X00.0","workup":["Test 1","Test 2"],"summary":"Brief explanation"},
    {"name":"Diagnosis 4","probability":0.2,"icdCode":"X00.0","workup":["Test 1","Test 2"],"summary":"Brief explanation"},
    {"name":"Diagnosis 5","probability":0.1,"icdCode":"X00.0","workup":["Test 1","Test 2"],"summary":"Brief explanation"}
  ],
  "prescription": {"medications":[{"name","dosage","frequency","duration","instructions"}],"advice","followUp"}
}`;
};
