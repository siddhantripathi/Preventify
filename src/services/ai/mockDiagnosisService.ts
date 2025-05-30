
import { AIResponse, Patient } from '@/types';
import { mockDiagnosisData } from './mockData';

export const generateMockDiagnosisAndPrescription = async (patient: Patient): Promise<AIResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock diagnoses based on simple rules
  const diagnoses = [];
  
  // Simple rule-based system for the demo
  if (patient.complaints?.toLowerCase().includes('headache')) {
    diagnoses.push(mockDiagnosisData.headache.tensionHeadache);
    diagnoses.push(mockDiagnosisData.headache.migraine);
  }
  
  if (patient.complaints?.toLowerCase().includes('fever')) {
    diagnoses.push(mockDiagnosisData.fever.viralFever);
    diagnoses.push(mockDiagnosisData.fever.typhoid);
  }
  
  if (patient.complaints?.toLowerCase().includes('cough')) {
    diagnoses.push(mockDiagnosisData.respiratory.commonCold);
    diagnoses.push(mockDiagnosisData.respiratory.bronchitis);
  }
  
  if (patient.complaints?.toLowerCase().includes('stomach') || patient.complaints?.toLowerCase().includes('abdomen')) {
    diagnoses.push(mockDiagnosisData.gastrointestinal.gastritis);
    diagnoses.push(mockDiagnosisData.gastrointestinal.gastroenteritis);
  }
  
  // If nothing specific is found, add generic diagnoses
  if (diagnoses.length === 0) {
    diagnoses.push(mockDiagnosisData.general.viralInfection);
    diagnoses.push(mockDiagnosisData.general.stressRelated);
  }
  
  // Add more diagnoses if needed to reach 5
  if (diagnoses.length < 5) {
    diagnoses.push(mockDiagnosisData.general.vitaminDeficiency);
    diagnoses.push(mockDiagnosisData.general.seasonalAllergy);
    diagnoses.push(mockDiagnosisData.general.anxietyDisorder);
  }
  
  // Sort by probability
  diagnoses.sort((a, b) => b.probability - a.probability);
  
  // Take only top 5
  const top5Diagnoses = diagnoses.slice(0, 5);
  
  // Generate mock prescription based on top diagnosis
  const topDiagnosis = top5Diagnoses[0];
  let prescription = {
    medications: [],
    advice: [],
    followUp: "2 weeks",
  };
  
  // Select prescription based on diagnosis
  if (topDiagnosis.name === 'Tension Headache') {
    prescription = mockDiagnosisData.prescriptions.tensionHeadache;
  } else if (topDiagnosis.name === 'Viral Fever') {
    prescription = mockDiagnosisData.prescriptions.viralFever;
  } else if (topDiagnosis.name === 'Common Cold') {
    prescription = mockDiagnosisData.prescriptions.commonCold;
  } else if (topDiagnosis.name === 'Gastritis') {
    prescription = mockDiagnosisData.prescriptions.gastritis;
  } else {
    prescription = mockDiagnosisData.prescriptions.generic;
  }
  
  return {
    diagnoses: top5Diagnoses,
    prescription,
  };
};
