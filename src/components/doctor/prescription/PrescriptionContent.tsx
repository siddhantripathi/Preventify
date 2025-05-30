
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Patient } from "@/types";
import PrescriptionHeader from "./PrescriptionHeader";
import PatientInfoSection from "./PatientInfoSection";
import DiagnosisSection from "./DiagnosisSection";
import ClinicalAssessmentSection from "./ClinicalAssessmentSection";
import WorkupNotesSection from "./WorkupNotesSection";
import MedicationsSection from "./MedicationsSection";
import AdviceSection from "./AdviceSection";
import FollowUpSection from "./FollowUpSection";
import PrescriptionFooter from "./PrescriptionFooter";

interface PrescriptionContentProps {
  patient: Patient;
  prescriptionData: any;
}

const PrescriptionContent = ({ patient, prescriptionData }: PrescriptionContentProps) => {
  return (
    <div id="prescription-preview" className="p-3 sm:p-6 bg-white text-xs sm:text-sm">
      {/* Header */}
      <PrescriptionHeader patientUhid={patient.uhid} />
      
      <Separator className="my-3 sm:my-4" />
      
      {/* Patient Information */}
      <PatientInfoSection patient={patient} />
      
      {/* Diagnosis */}
      <DiagnosisSection diagnoses={prescriptionData.diagnoses || []} />
      
      {/* Clinical Assessment */}
      {prescriptionData.clinicalAssessment && (
        <ClinicalAssessmentSection clinicalAssessment={prescriptionData.clinicalAssessment} />
      )}
      
      {/* Workup Notes */}
      {prescriptionData.workupNotes && Object.keys(prescriptionData.workupNotes).length > 0 && (
        <WorkupNotesSection workupNotes={prescriptionData.workupNotes} />
      )}
      
      {/* Medications */}
      <MedicationsSection medications={prescriptionData.medications || []} />
      
      {/* Advice */}
      <AdviceSection advice={prescriptionData.advice || []} />
      
      {/* Follow-up */}
      <FollowUpSection followUp={prescriptionData.followUp} />
      
      <Separator className="my-3 sm:my-4" />
      
      {/* Footer */}
      <PrescriptionFooter />
    </div>
  );
};

export default PrescriptionContent;
