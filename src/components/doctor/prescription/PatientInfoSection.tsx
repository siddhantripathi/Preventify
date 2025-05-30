
import { Patient } from "@/types";

interface PatientInfoSectionProps {
  patient: Patient;
}

const PatientInfoSection = ({ patient }: PatientInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Patient Details</h3>
        <p className="font-medium">{patient.name}</p>
        <p className="text-xs sm:text-sm">
          {patient.age} years, {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
        </p>
        <p className="text-xs sm:text-sm">UHID: {patient.uhid}</p>
      </div>
      
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-500">Vital Signs</h3>
        <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 text-xs sm:text-sm">
          <p>BP: {patient.vitals.bp}</p>
          <p>Pulse: {patient.vitals.hr} bpm</p>
          <p>Temp: {patient.vitals.tp}°C</p>
          <p>SpO2: {patient.vitals.spo2}%</p>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoSection;
