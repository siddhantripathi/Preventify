
import { Patient } from "@/types";
import { format } from "date-fns";
import { Clock, UserCircle, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueuedPatientItemProps {
  patient: Patient;
  onEdit: (patientId: string) => void;
}

const QueuedPatientItem = ({ patient, onEdit }: QueuedPatientItemProps) => {
  // Calculate wait time (in a real app, this would be based on actual timestamps)
  const getWaitTime = () => {
    const waitMinutes = patient.status === 'waiting' 
      ? Math.floor(Math.random() * 60) + 5 
      : Math.floor(Math.random() * 30) + 2;
      
    return `${waitMinutes} min`;
  };
  
  // Get appropriate status style
  const getStatusStyle = () => {
    return patient.status === 'waiting'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg transition-all hover:bg-gray-50 border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <UserCircle size={24} />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{patient.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{patient.age} years</span>
            <span className="text-gray-300">•</span>
            <span>{patient.gender}</span>
            <span className="text-gray-300">•</span>
            <span>UHID: {patient.uhid}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle()}`}>
          {patient.status === 'waiting' ? 'Waiting' : 'In Progress'}
        </span>
        
        <div className="flex items-center text-sm text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>{getWaitTime()}</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-white"
          onClick={() => onEdit(patient.id)}
        >
          <Edit size={14} />
          <span className="hidden sm:inline">Edit</span>
        </Button>
      </div>
    </div>
  );
};

export default QueuedPatientItem;
