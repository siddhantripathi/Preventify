
import { TableCell, TableRow } from "@/components/ui/table";
import { Patient, Prescription } from "@/types";
import PatientVitalsDisplay from "./PatientVitalsDisplay";
import PatientStatusBadge from "./PatientStatusBadge";
import { useAdmin } from "@/contexts/AdminContext";

interface PatientTableRowProps {
  patient: Patient;
  prescriptionCount: number;
}

const PatientTableRow = ({ patient, prescriptionCount }: PatientTableRowProps) => {
  const { locations } = useAdmin();

  // Function to get location name based on locationId
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : locationId;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{patient.name}</TableCell>
      <TableCell>{patient.age} / {patient.gender}</TableCell>
      <TableCell>{patient.uhid}</TableCell>
      <TableCell>{getLocationName(patient.locationId)}</TableCell>
      <TableCell>
        <PatientVitalsDisplay vitals={patient.vitals} />
      </TableCell>
      <TableCell>
        <PatientStatusBadge status={patient.status} />
      </TableCell>
      <TableCell>{prescriptionCount}</TableCell>
    </TableRow>
  );
};

export default PatientTableRow;
