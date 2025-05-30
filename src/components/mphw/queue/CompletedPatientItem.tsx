
import { Patient } from "@/types";
import { format } from "date-fns";
import { CheckCircle, RefreshCw, FileText, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletedPatientItemProps {
  patient: Patient;
  onRevisit: (patient: Patient) => void;
  onViewDetails: (patientId: string) => void;
}

const CompletedPatientItem = ({ patient, onRevisit, onViewDetails }: CompletedPatientItemProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg transition-all hover:bg-gray-50 border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          <CheckCircle size={18} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{patient.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{patient.age} years</span>
            <span className="text-gray-300">•</span>
            <span>{patient.gender}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">
              {format(patient.updatedAt, "hh:mm a")}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mt-2 sm:mt-0">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-white"
          onClick={() => onRevisit(patient)}
        >
          <RefreshCw size={14} />
          <span>Re-visit</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-white"
          onClick={() => onViewDetails(patient.id)}
        >
          <FileText size={14} />
          <span>Details</span>
        </Button>
      </div>
    </div>
  );
};

export default CompletedPatientItem;
