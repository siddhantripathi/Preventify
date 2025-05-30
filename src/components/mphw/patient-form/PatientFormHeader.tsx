
import { Badge } from "@/components/ui/badge";

interface PatientFormHeaderProps {
  patientId: string;
}

const PatientFormHeader = ({ patientId }: PatientFormHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">Patient Registration</h2>
        <p className="text-sm text-gray-500">
          Enter patient details and add them to the queue
        </p>
      </div>
      <Badge variant="outline" className="text-sm py-1">
        Patient ID: {patientId}
      </Badge>
    </div>
  );
};

export default PatientFormHeader;
