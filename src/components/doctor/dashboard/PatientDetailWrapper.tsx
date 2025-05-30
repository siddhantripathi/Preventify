
import React from "react";
import PatientDetailFullscreenModal from "./PatientDetailFullscreenModal";
import PatientDetailWorkflow from "./PatientDetailWorkflow";
import PatientEditBeforeDiagnosis from "@/components/doctor/PatientEditBeforeDiagnosis";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Diagnosis } from "@/types";

interface PatientDetailWrapperProps {
  currentPatient: any;
  showFullscreen: boolean;
  setShowFullscreen: (show: boolean) => void;
  aiDiagnosis: any;
  singleSelectedDiagnosis: Diagnosis | null;
  prescriptionData: any;
  workupData: any;
  editPatientDialogOpen: boolean;
  setEditPatientDialogOpen: (open: boolean) => void;
  aiLoading: boolean;
  onDiagnosisSelect: (diagnosis: Diagnosis) => void;
  onCompleteWorkup: (diagnoses: Diagnosis[], prescData: any, workupData: any) => void;
  onCloseCase: () => void;
  onSendBackToQueue: () => void;
  onAIDiagnosis: () => void;
}

const PatientDetailWrapper = ({
  currentPatient,
  showFullscreen,
  setShowFullscreen,
  aiDiagnosis,
  singleSelectedDiagnosis,
  prescriptionData,
  workupData,
  editPatientDialogOpen,
  setEditPatientDialogOpen,
  aiLoading,
  onDiagnosisSelect,
  onCompleteWorkup,
  onCloseCase,
  onSendBackToQueue,
  onAIDiagnosis
}: PatientDetailWrapperProps) => {
  return (
    <>
      <PatientDetailFullscreenModal open={showFullscreen} onOpenChange={setShowFullscreen}>
        <PatientDetailWorkflow
          currentPatient={currentPatient}
          aiDiagnosis={aiDiagnosis}
          singleSelectedDiagnosis={singleSelectedDiagnosis}
          prescriptionData={prescriptionData}
          workupData={workupData}
          onDiagnosisSelect={onDiagnosisSelect}
          onCompleteWorkup={onCompleteWorkup}
          onCloseCase={onCloseCase}
          onSendBackToQueue={onSendBackToQueue}
          onEditPatient={() => setEditPatientDialogOpen(true)}
          onAIDiagnosis={onAIDiagnosis}
          aiLoading={aiLoading}
        />
      </PatientDetailFullscreenModal>
      
      {currentPatient && (
        <Dialog open={editPatientDialogOpen} onOpenChange={setEditPatientDialogOpen}>
          <DialogContent className="sm:max-w-4xl bg-white">
            <DialogHeader>
              <DialogTitle>Edit Patient Information</DialogTitle>
            </DialogHeader>
            <PatientEditBeforeDiagnosis
              patient={currentPatient}
              onClose={() => setEditPatientDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PatientDetailWrapper;
