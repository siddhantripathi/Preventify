
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import CompletedPatientItem from "./CompletedPatientItem";
import { Patient } from "@/types";

type CompletedConsultationsProps = {
  patients: Patient[];
  loading: boolean;
  onRevisit: (patient: Patient) => void;
};

const CompletedConsultations = ({ patients, loading, onRevisit }: CompletedConsultationsProps) => {
  // Function to handle viewing patient details
  const handleViewDetails = (patientId: string) => {
    // This is a placeholder function that would typically navigate to patient details
    console.log("View details for patient:", patientId);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-medical-primary" />
          <span>Completed Consultations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading completed consultations...</div>
        ) : patients.length > 0 ? (
          <div className="space-y-4">
            {patients.map((patient) => (
              <CompletedPatientItem
                key={patient.id}
                patient={patient}
                onRevisit={onRevisit}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No completed consultations yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedConsultations;
