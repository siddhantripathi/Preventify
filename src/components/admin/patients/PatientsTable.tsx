
import { Patient, Prescription } from "@/types";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import PatientTableHeader from "./PatientTableHeader";
import PatientTableRow from "./PatientTableRow";

interface PatientsTableProps {
  patients: Patient[];
  prescriptions: Prescription[];
}

const PatientsTable = ({ patients, prescriptions }: PatientsTableProps) => {
  if (patients.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No patients found.</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <PatientTableHeader />
        <TableBody>
          {patients.map((patient) => {
            const patientPrescriptions = prescriptions.filter(
              p => p.patientId === patient.id
            );
            
            return (
              <PatientTableRow 
                key={patient.id}
                patient={patient}
                prescriptionCount={patientPrescriptions.length}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatientsTable;
