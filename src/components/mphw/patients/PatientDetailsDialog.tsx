
import { format } from "date-fns";
import { Patient, Prescription } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PatientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  prescriptions: Prescription[];
}

const PatientDetailsDialog = ({
  open,
  onOpenChange,
  patient,
  prescriptions,
}: PatientDetailsDialogProps) => {
  if (!patient) return null;

  // Get patient's previous prescriptions
  const patientPrescriptions = prescriptions
    .filter(p => p.patientId === patient.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Past Visit Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.age} years, {patient.gender}, UHID: {patient.uhid}
              {patient.mobile && `, Mobile: ${patient.mobile}`}
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Patient History</h4>
            <p className="text-sm border p-3 rounded-md bg-muted">
              {patient.history || "No history recorded"}
            </p>
          </div>

          <div>
            <h4 className="text-md font-medium mb-2">Previous Prescriptions</h4>
            {patientPrescriptions.length > 0 ? (
              <div className="space-y-4">
                {patientPrescriptions.map((prescription, index) => (
                  <Card key={prescription.id}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm flex justify-between">
                        <span>Visit Date: {format(prescription.createdAt, "PPP")}</span>
                        {index === 0 && <Badge className="bg-medical-primary">Latest</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-3">
                      <div className="text-sm">
                        <div className="mb-2">
                          <span className="font-medium">Diagnoses: </span>
                          {prescription.diagnoses.join(", ")}
                        </div>

                        {prescription.medications && prescription.medications.length > 0 && (
                          <div className="mb-2">
                            <span className="font-medium">Medications:</span>
                            <ul className="list-disc pl-5 mt-1">
                              {prescription.medications.map((med, i) => (
                                <li key={i}>
                                  {med.name} {med.dosage && `- ${med.dosage}`} 
                                  {med.frequency && `, ${med.frequency}`}
                                  {med.duration && `, for ${med.duration}`}
                                  {med.instructions && ` (${med.instructions})`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {prescription.clinicalAssessment && (
                          <div className="mb-2">
                            <span className="font-medium">Clinical Assessment: </span>
                            {prescription.clinicalAssessment}
                          </div>
                        )}

                        {prescription.advice && prescription.advice.length > 0 && (
                          <div className="mb-2">
                            <span className="font-medium">Advice:</span>
                            <ul className="list-disc pl-5 mt-1">
                              {prescription.advice.map((advice, i) => (
                                <li key={i}>{advice}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {prescription.followUp && (
                          <div>
                            <span className="font-medium">Follow-up: </span>
                            {prescription.followUp}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No prescriptions found for this patient.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsDialog;
