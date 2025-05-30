
// International Classification of Diseases (ICD-10) codes for common symptoms and diagnoses

export interface ICDCode {
  code: string;
  description: string;
}

// Common symptoms with ICD-10 codes
export const symptomCodes: ICDCode[] = [
  { code: "R50.9", description: "Fever, unspecified" },
  { code: "R51", description: "Headache" },
  { code: "R07.0", description: "Pain in throat" },
  { code: "R07.4", description: "Chest pain, unspecified" },
  { code: "R10.4", description: "Other and unspecified abdominal pain" },
  { code: "R11.0", description: "Nausea" },
  { code: "R11.1", description: "Vomiting" },
  { code: "R11.2", description: "Nausea with vomiting" },
  { code: "R05", description: "Cough" },
  { code: "R06.0", description: "Dyspnea" },
  { code: "R53.1", description: "Weakness" },
  { code: "R53.83", description: "Fatigue" },
  { code: "R20.2", description: "Paresthesia of skin" },
  { code: "R42", description: "Dizziness and giddiness" },
  { code: "R60.0", description: "Localized edema" },
  { code: "R60.1", description: "Generalized edema" },
  { code: "R06.2", description: "Wheezing" },
  { code: "R04.0", description: "Epistaxis (Nosebleed)" },
  { code: "R19.7", description: "Diarrhea" },
  { code: "R63.0", description: "Anorexia (loss of appetite)" },
  { code: "R33.9", description: "Retention of urine, unspecified" },
  { code: "R35.0", description: "Frequency of micturition" },
  { code: "R52", description: "Pain, unspecified" },
  { code: "R21", description: "Rash and other nonspecific skin eruption" },
];

// Common diagnoses with ICD-10 codes
export const diagnosisCodes: ICDCode[] = [
  { code: "J00", description: "Acute nasopharyngitis [common cold]" },
  { code: "J02.9", description: "Acute pharyngitis, unspecified" },
  { code: "J03.90", description: "Acute tonsillitis, unspecified" },
  { code: "J18.9", description: "Pneumonia, unspecified" },
  { code: "J45.909", description: "Unspecified asthma, uncomplicated" },
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
  { code: "I10", description: "Essential (primary) hypertension" },
  { code: "K29.70", description: "Gastritis, unspecified, without bleeding" },
  { code: "K30", description: "Functional dyspepsia" },
  { code: "A09", description: "Infectious gastroenteritis and colitis, unspecified" },
  { code: "B34.9", description: "Viral infection, unspecified" },
  { code: "H66.90", description: "Otitis media, unspecified, unspecified ear" },
  { code: "H10.9", description: "Unspecified conjunctivitis" },
  { code: "L03.90", description: "Cellulitis, unspecified" },
  { code: "L50.9", description: "Urticaria, unspecified" },
  { code: "M54.5", description: "Low back pain" },
  { code: "N39.0", description: "Urinary tract infection, site not specified" },
  { code: "R10.9", description: "Unspecified abdominal pain" },
  { code: "G43.909", description: "Migraine, unspecified, not intractable, without status migrainosus" },
  { code: "F41.9", description: "Anxiety disorder, unspecified" },
  { code: "F32.9", description: "Major depressive disorder, single episode, unspecified" },
  { code: "A41.9", description: "Sepsis, unspecified organism" },
  { code: "I21.9", description: "Acute myocardial infarction, unspecified site" },
  { code: "E86.0", description: "Dehydration" },
  { code: "J20.9", description: "Acute bronchitis, unspecified" },
  { code: "K35.80", description: "Unspecified acute appendicitis" },
  { code: "K80.00", description: "Calculus of gallbladder with acute cholecystitis without obstruction" },
  { code: "N20.0", description: "Calculus of kidney" },
  { code: "I63.9", description: "Cerebral infarction, unspecified" },
  { code: "I50.9", description: "Heart failure, unspecified" },
];

// Function to get diagnosis object by code
export const getDiagnosisByCode = (code: string): ICDCode | undefined => {
  return diagnosisCodes.find(diag => diag.code === code);
};

// Function to get symptom object by code
export const getSymptomByCode = (code: string): ICDCode | undefined => {
  return symptomCodes.find(symptom => symptom.code === code);
};

// Function to get formatted ICD code display
export const formatICDCode = (icdCode: ICDCode): string => {
  return `${icdCode.code} - ${icdCode.description}`;
};
