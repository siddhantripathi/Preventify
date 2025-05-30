
import { format } from "date-fns";

interface PrescriptionHeaderProps {
  patientUhid: string;
}

const PrescriptionHeader = ({ patientUhid }: PrescriptionHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-medical-primary">Preventify Health</h2>
        <p className="text-xs sm:text-sm text-gray-500">Digital Healthcare Platform</p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-xs sm:text-sm font-medium">Date: {format(new Date(), 'PPP')}</p>
        <p className="text-xs text-gray-500">Ref: PRE-{patientUhid}</p>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
