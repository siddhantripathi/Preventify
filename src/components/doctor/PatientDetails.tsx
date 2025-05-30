
import { usePatient } from "@/contexts/PatientContext";
import PatientInfoCard from "./PatientInfoCard";
import PatientVitalsCard from "./PatientVitalsCard";
import PatientMedicalInfoCard from "./PatientMedicalInfoCard";

const PatientDetails = () => {
  const { currentPatient, getPrescriptionsForPatient } = usePatient();

  if (!currentPatient) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a patient to view details</p>
      </div>
    );
  }

  const prescription = getPrescriptionsForPatient(currentPatient.id)[0];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <PatientInfoCard patient={currentPatient} />
        <PatientVitalsCard patient={currentPatient} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <PatientMedicalInfoCard patient={currentPatient} prescription={prescription} />
      </div>
    </div>
  );
};

export default PatientDetails;
