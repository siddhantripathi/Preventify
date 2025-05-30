
import { Diagnosis } from '@/types';

// Mock diagnoses organized by category
export const mockDiagnosisData = {
  headache: {
    tensionHeadache: {
      name: 'Tension Headache',
      probability: 0.75,
      workup: ['Complete Blood Count', 'Visual Acuity Test'],
      summary: "Tension headaches are the most common type of headache, characterized by mild to moderate pain that feels like a tight band around the head. They affect up to 80% of adults occasionally. Caused primarily by muscle contractions in the head and neck, often triggered by stress, poor posture, or lack of sleep. These headaches typically respond well to over-the-counter pain relievers and lifestyle modifications."
    },
    migraine: {
      name: 'Migraine',
      probability: 0.65,
      workup: ['CT Scan', 'Neurological Examination'],
      summary: "Migraines are recurrent, debilitating headaches often accompanied by nausea, sensitivity to light and sound, and visual disturbances. Affecting approximately 12% of the population, they are more common in women. Migraines typically last 4-72 hours and may be preceded by warning signs called auras. Treatment includes both preventive medications and pain-relieving medications during attacks."
    }
  },
  fever: {
    viralFever: {
      name: 'Viral Fever',
      probability: 0.8,
      workup: ['Complete Blood Count', 'Malaria Test'],
      summary: "Viral fever refers to a broad range of infections characterized by elevated body temperature caused by viral pathogens. These self-limiting infections typically last 3-7 days and may present with headache, body aches, and fatigue. Most common in seasonal transitions, viral fevers affect billions annually worldwide. Treatment focuses on symptomatic relief rather than antiviral therapy in most cases."
    },
    typhoid: {
      name: 'Typhoid',
      probability: 0.4,
      workup: ['Widal Test', 'Blood Culture'],
      summary: "Typhoid fever is a bacterial infection caused by Salmonella Typhi, transmitted through contaminated food and water. It affects approximately 11-20 million people annually, primarily in developing regions with poor sanitation. Symptoms develop gradually and include persistent high fever, headaches, and abdominal pain. Without proper antibiotic treatment, complications can occur in 10-15% of cases."
    }
  },
  respiratory: {
    commonCold: {
      name: 'Common Cold',
      probability: 0.7,
      workup: ['Chest X-ray', 'Throat Swab'],
      summary: "The common cold is a viral upper respiratory infection primarily caused by rhinoviruses. It is the most frequent infectious disease in humans, with adults averaging 2-3 colds annually and children up to 8-10. Symptoms progress from sore throat to nasal congestion, sneezing and cough, typically resolving within 7-10 days without specific treatment. Complications are rare but can include sinusitis or ear infections."
    },
    bronchitis: {
      name: 'Bronchitis',
      probability: 0.5,
      workup: ['Chest X-ray', 'Sputum Test'],
      summary: "Bronchitis is inflammation of the bronchial tubes in the lungs, causing cough with mucus production. Acute bronchitis, usually caused by viruses, affects millions annually and typically resolves in 1-3 weeks. Chronic bronchitis, often associated with smoking, involves persistent cough for at least three months in two consecutive years. Treatment focuses on symptom relief, though antibiotics may be necessary for bacterial infections."
    }
  },
  gastrointestinal: {
    gastritis: {
      name: 'Gastritis',
      probability: 0.65,
      workup: ['Complete Blood Count', 'Stool Examination'],
      summary: "Gastritis is inflammation of the stomach lining, which can be acute or chronic. It affects approximately 50% of the global population to some degree. Common causes include H. pylori infection, NSAIDs, alcohol consumption, and autoimmune responses. Symptoms include upper abdominal pain, nausea, and sometimes vomiting. Most cases resolve with appropriate treatment, though chronic gastritis may increase risk of gastric cancer."
    },
    gastroenteritis: {
      name: 'Gastroenteritis',
      probability: 0.55,
      workup: ['Stool Culture', 'Abdominal Ultrasound'],
      summary: "Gastroenteritis is inflammation of the gastrointestinal tract affecting both stomach and intestines. Commonly known as \"stomach flu,\" it causes diarrhea, vomiting, abdominal pain, and sometimes fever. It affects 2 billion people annually, with norovirus and rotavirus being common viral causes. Most cases are self-limiting, resolving within 2-5 days, though severe cases can lead to dehydration requiring medical intervention."
    }
  },
  general: {
    viralInfection: {
      name: 'Viral Infection',
      probability: 0.5,
      workup: ['Complete Blood Count', 'C-Reactive Protein'],
      summary: "Viral infections encompass a diverse range of pathologies caused by viral pathogens. They are responsible for billions of illnesses annually worldwide, from minor respiratory infections to severe systemic diseases. Symptoms vary widely depending on the virus and affected systems but often include fever, fatigue, and inflammation. Most cases resolve with supportive care within 1-2 weeks, though some may progress to more serious conditions."
    },
    stressRelated: {
      name: 'Stress-Related Condition',
      probability: 0.4,
      workup: ['Thyroid Function Test', 'Blood Pressure Monitoring'],
      summary: "Stress-related conditions result from psychological strain manifesting as physical symptoms. Affecting up to 75% of adults, these psychosomatic disorders can present as headaches, fatigue, digestive issues, or sleep disturbances. Chronic stress activates the body's fight-or-flight response, releasing cortisol and other stress hormones. Treatment typically involves stress management techniques, lifestyle modifications, and sometimes cognitive behavioral therapy."
    },
    vitaminDeficiency: {
      name: 'Vitamin Deficiency',
      probability: 0.3,
      workup: ['Vitamin Panel', 'Complete Blood Count'],
      summary: "Vitamin deficiency occurs when the body lacks adequate vitamins for optimal function. Affecting billions globally, common deficiencies include vitamins D, B12, and iron. Symptoms vary by deficiency but may include fatigue, weakened immunity, and neurological issues. Causes include poor diet, malabsorption, or increased requirements during pregnancy. Treatment involves supplementation and dietary changes, with most patients showing improvement within weeks to months."
    },
    seasonalAllergy: {
      name: 'Seasonal Allergy',
      probability: 0.25,
      workup: ['Allergy Test', 'IgE Levels'],
      summary: "Seasonal allergies, or hay fever, result from immune responses to environmental allergens like pollen. Affecting 10-30% of the population worldwide, they present with sneezing, nasal congestion, itchy eyes, and sometimes asthma. Symptoms typically follow predictable patterns corresponding to specific pollen seasons. Management includes allergen avoidance, antihistamines, nasal corticosteroids, and in severe cases, immunotherapy for long-term relief."
    },
    anxietyDisorder: {
      name: 'Anxiety Disorder',
      probability: 0.2,
      workup: ['Psychological Assessment', 'Thyroid Function Test'],
      summary: "Anxiety disorders involve excessive worry, fear, and physical symptoms that interfere with daily functioning. They affect approximately 4% of the global population, making them the most common mental health disorders worldwide. Characterized by persistent anxiety disproportionate to actual threats, they may manifest as panic attacks, social anxiety, or generalized anxiety. Treatment typically combines cognitive behavioral therapy and sometimes medication, with 60-80% of patients showing improvement."
    }
  },
  prescriptions: {
    tensionHeadache: {
      medications: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "3 times a day",
          duration: "5 days",
          instructions: "Take after food",
        },
        {
          name: "Ibuprofen",
          dosage: "400mg",
          frequency: "twice a day",
          duration: "3 days",
          instructions: "Take after food if pain persists",
        }
      ],
      advice: [
        "Avoid triggers like stress and lack of sleep",
        "Apply cold or warm compress",
        "Practice relaxation techniques",
      ],
      followUp: "2 weeks",
    },
    viralFever: {
      medications: [
        {
          name: "Paracetamol",
          dosage: "650mg",
          frequency: "3-4 times a day",
          duration: "5 days",
          instructions: "Take when temperature is above 100°F",
        },
        {
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "once a day",
          duration: "3 days",
          instructions: "Take at night before sleep",
        }
      ],
      advice: [
        "Drink plenty of fluids",
        "Take complete rest",
        "Eat light and easily digestible food",
      ],
      followUp: "2 weeks",
    },
    commonCold: {
      medications: [
        {
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "once a day",
          duration: "5 days",
          instructions: "Take at night",
        },
        {
          name: "Phenylephrine",
          dosage: "10mg",
          frequency: "3 times a day",
          duration: "3 days",
          instructions: "Take after food",
        }
      ],
      advice: [
        "Steam inhalation twice daily",
        "Gargle with warm salt water",
        "Avoid cold beverages",
      ],
      followUp: "2 weeks",
    },
    gastritis: {
      medications: [
        {
          name: "Pantoprazole",
          dosage: "40mg",
          frequency: "once a day",
          duration: "7 days",
          instructions: "Take before breakfast",
        },
        {
          name: "Domperidone",
          dosage: "10mg",
          frequency: "3 times a day",
          duration: "5 days",
          instructions: "Take 15 minutes before food",
        }
      ],
      advice: [
        "Avoid spicy and oily food",
        "Eat small and frequent meals",
        "Avoid tea, coffee and alcohol",
      ],
      followUp: "2 weeks",
    },
    generic: {
      medications: [
        {
          name: "Multivitamin",
          dosage: "1 tablet",
          frequency: "once a day",
          duration: "30 days",
          instructions: "Take after breakfast",
        }
      ],
      advice: [
        "Maintain a balanced diet",
        "Exercise regularly",
        "Get adequate sleep",
      ],
      followUp: "2 weeks",
    }
  }
};
