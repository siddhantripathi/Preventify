
import React from "react";
import WorkupDataEntry from "./WorkupDataEntry";
import PrescriptionForm from "./PrescriptionForm";
import { Diagnosis } from "@/types";

interface DiagnosisBasedFlowProps {
  selectedDiagnosis: Diagnosis | null;
  prescriptionData: any;
  workupData: any;
  onCompleteWorkup: (
    updatedDiagnoses: Diagnosis[],
    updatedPrescriptionData: any,
    updatedWorkupData: any
  ) => void;
}

const DiagnosisBasedFlow = ({
  selectedDiagnosis,
  prescriptionData,
  workupData,
  onCompleteWorkup,
}: DiagnosisBasedFlowProps) => {
  if (!selectedDiagnosis) return null;

  // For next steps, wrap selected diagnosis as array for Workup/Prescription
  const selectedDiagnosesArr = [selectedDiagnosis];

  return (
    <div>
      {/* Workup Data Entry */}
      <div className="my-3">
        <WorkupDataEntry
          selectedDiagnoses={selectedDiagnosesArr}
          prescriptionData={prescriptionData}
          onComplete={onCompleteWorkup}
        />
      </div>
      {/* Prescription Form */}
      <div className="my-3">
        <PrescriptionForm
          selectedDiagnoses={selectedDiagnosesArr}
          prescriptionData={prescriptionData}
          workupData={workupData}
        />
      </div>
    </div>
  );
};

export default DiagnosisBasedFlow;
