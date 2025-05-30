
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Patient, Prescription } from "@/types";

interface PatientMedicalInfoCardProps {
  patient: Patient;
  prescription?: Prescription;
}

const PatientMedicalInfoCard = ({ patient, prescription }: PatientMedicalInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg flex items-center gap-1 sm:gap-2">
          <Clipboard className="h-4 w-4 sm:h-5 sm:w-5 text-medical-primary" />
          Medical Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
          <div>
            <h4 className="font-medium text-xs sm:text-sm text-gray-500 mb-1">Patient History</h4>
            <p className="text-xs sm:text-sm">
              {patient.history || "No medical history recorded"}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-xs sm:text-sm text-gray-500 mb-1">Current Complaints</h4>
            <p className="text-xs sm:text-sm">{patient.complaints}</p>
          </div>
          {patient.doctorNotes && (
            <div>
              <h4 className="font-medium text-xs sm:text-sm text-gray-500 mb-1">Doctor's Notes</h4>
              <p className="text-xs sm:text-sm bg-gray-50 p-2 rounded-md whitespace-pre-line">
                {patient.doctorNotes}
              </p>
            </div>
          )}
          {prescription && (
            <>
              <div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-500 mb-1">Diagnosis</h4>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {prescription.diagnoses.map((diagnosis, index) => (
                    <Badge key={index} variant="outline" className="bg-medical-primary/10 text-medical-primary text-xs">
                      {diagnosis}
                    </Badge>
                  ))}
                </div>
              </div>
              {prescription.clinicalAssessment && (
                <div>
                  <h4 className="font-medium text-xs sm:text-sm text-gray-500 mb-1">
                    Clinical Assessment
                  </h4>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-md text-xs sm:text-sm whitespace-pre-line">
                    {prescription.clinicalAssessment}
                  </div>
                </div>
              )}
              {prescription.workupNotes && Object.keys(prescription.workupNotes).length > 0 && (
                <div>
                  <h4 className="font-medium text-xs sm:text-sm text-gray-500 mb-1 flex items-center">
                    <ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Workup Results
                  </h4>
                  <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-2">
                    {Object.entries(prescription.workupNotes).map(([diagnosis, notes], index) => (
                      <div key={index} className="bg-gray-50 p-1.5 sm:p-2 rounded-md">
                        <p className="text-xs font-medium text-medical-primary">{diagnosis}</p>
                        <p className="text-xs mt-0.5 sm:mt-1">{String(notes)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientMedicalInfoCard;
