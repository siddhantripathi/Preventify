
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import QueuedPatientItem from "./QueuedPatientItem";

type PatientQueueListProps = {
  patients: any[];
  loading: boolean;
  onEdit: (patientId: string) => void;
};

const PatientQueueList = ({ patients, loading, onEdit }: PatientQueueListProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-medical-primary" />
          <span>Patient Queue</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading patient queue...</div>
        ) : patients.length > 0 ? (
          <div className="space-y-4">
            {patients.map((patient) => (
              <QueuedPatientItem
                key={patient.id}
                patient={patient}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No patients in queue. Add a patient from the New Patient tab.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientQueueList;
