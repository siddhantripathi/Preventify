
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MedicationsSectionProps {
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
}

const MedicationsSection = ({ medications }: MedicationsSectionProps) => {
  // Make sure medications is an array
  const medicationsArray = Array.isArray(medications) ? medications : [];
  
  if (!medicationsArray || medicationsArray.length === 0) return null;

  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Medications</h3>
      <div className="overflow-x-auto border border-gray-100 rounded-md">
        <Table className="text-xs sm:text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium w-1/4">Medication</TableHead>
              <TableHead className="font-medium w-1/5">Dosage</TableHead>
              <TableHead className="font-medium w-1/5">Frequency</TableHead>
              <TableHead className="font-medium w-1/5">Duration</TableHead>
              <TableHead className="font-medium w-2/5">Instructions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicationsArray.map((med, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="font-medium">{med.name || ""}</TableCell>
                <TableCell>{med.dosage || ""}</TableCell>
                <TableCell>{med.frequency || ""}</TableCell>
                <TableCell>{med.duration || ""}</TableCell>
                <TableCell>{med.instructions || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MedicationsSection;
