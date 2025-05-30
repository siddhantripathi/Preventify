
import { Patient } from "@/types";

const conditions = [
  {
    complaints: "Fever and cough",
    history: "No previous medical history.",
    vitals: () => ({ hr: 92, bp: "122/80", rr: 18, tp: 100.3, spo2: 97, weight: 65, height: 170 }),
  },
  {
    complaints: "Shortness of breath",
    history: "Asthma since childhood.",
    vitals: () => ({ hr: 110, bp: "130/85", rr: 24, tp: 98.9, spo2: 93, weight: 60, height: 168 }),
  },
  {
    complaints: "Chest pain on exertion",
    history: "Hypertension for 5 years.",
    vitals: () => ({ hr: 88, bp: "150/94", rr: 20, tp: 98.6, spo2: 96, weight: 72, height: 175 }),
  },
  {
    complaints: "Headache and dizziness",
    history: "History of migraines.",
    vitals: () => ({ hr: 77, bp: "118/76", rr: 16, tp: 98.6, spo2: 98, weight: 56, height: 167 }),
  },
  {
    complaints: "Abdominal pain",
    history: "Recently recovered from gastroenteritis.",
    vitals: () => ({ hr: 82, bp: "115/74", rr: 14, tp: 99.1, spo2: 99, weight: 62, height: 168 }),
  },
  {
    complaints: "Frequent urination and thirst",
    history: "Family history of diabetes.",
    vitals: () => ({ hr: 84, bp: "124/78", rr: 15, tp: 98.7, spo2: 97, weight: 75, height: 173 }),
  },
  {
    complaints: "Back pain",
    history: "Manual labor job, no chronic illnesses.",
    vitals: () => ({ hr: 73, bp: "118/70", rr: 14, tp: 98.6, spo2: 99, weight: 82, height: 180 }),
  },
  {
    complaints: "Joint pain, especially mornings",
    history: "Diagnosed with rheumatoid arthritis.",
    vitals: () => ({ hr: 72, bp: "130/80", rr: 18, tp: 98.6, spo2: 98, weight: 67, height: 162 }),
  },
  {
    complaints: "Skin rash",
    history: "No known allergies.",
    vitals: () => ({ hr: 88, bp: "121/79", rr: 16, tp: 98.9, spo2: 98, weight: 58, height: 155 }),
  },
  {
    complaints: "Swelling in legs",
    history: "Congestive heart failure under treatment.",
    vitals: () => ({ hr: 96, bp: "145/92", rr: 22, tp: 98.6, spo2: 94, weight: 95, height: 176 }),
  },
];

const firstNames = ["John", "Priya", "Amit", "Fatima", "David", "Lina", "Mohammed", "Zara", "Li", "Maya"];
const lastNames = ["Kumar", "Sharma", "Patel", "Chen", "Smith", "Almeida", "Singh", "Khan", "Nair", "Das"];
const genders = ["male", "female", "other"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockPatients(count: number): Omit<Patient, "id" | "createdAt" | "updatedAt">[] {
  const patients = [];
  for (let i = 0; i < count; ++i) {
    const condition = conditions[i % conditions.length];
    const gender = randomFrom(genders) as "male" | "female" | "other";
    const age = randomInt(1, 90);
    patients.push({
      name: `${randomFrom(firstNames)} ${randomFrom(lastNames)}`,
      age,
      gender,
      uhid: `MOCK${1000 + i}`,
      locationId: "Location 1",
      doctorId: undefined,
      visitTag: "consultation",
      vitals: condition.vitals(),
      history: condition.history,
      complaints: condition.complaints,
      doctorNotes: "",
      status: "waiting",
      mobile: "99988877" + String(10 + (i % 90)),
      documents: [],
      // createdAt/updatedAt/id will be filled when added
    });
  }
  return patients;
}
