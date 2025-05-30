
import React from "react";
import PatientDetails from "@/components/doctor/PatientDetails";
import PatientDocuments from "@/components/doctor/PatientDocuments";
import PatientActionButtons from "@/components/doctor/PatientActionButtons";
import DifferentialDiagnosisSelector from "@/components/doctor/DifferentialDiagnosisSelector";
import DiagnosisBasedFlow from "@/components/doctor/DiagnosisBasedFlow";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";
import PatientEditBeforeDiagnosis from "@/components/doctor/PatientEditBeforeDiagnosis";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DoctorPatientPanelProps {
  currentPatient: any;
  aiDiagnosis: any;
  singleSelectedDiagnosis: any;
  prescriptionData: any;
  workupData: any;
  previewModalOpen: boolean;
  setPreviewModalOpen: (open: boolean) => void;
  editPatientDialogOpen: boolean;
  setEditPatientDialogOpen: (open: boolean) => void;
  aiLoading: boolean;
  onAIDiagnosis: () => void;
  onEditClick: () => void;
  onDiagnosisSelect: (diagnosis: any) => void;
  onCompleteWorkup: (d: any, p: any, w: any) => void;
  existingPrescription: any;
  handleViewSavedPrescription: () => void;
}

const DoctorPatientPanel = ({
  currentPatient,
  aiDiagnosis,
  singleSelectedDiagnosis,
  prescriptionData,
  workupData,
  previewModalOpen,
  setPreviewModalOpen,
  editPatientDialogOpen,
  setEditPatientDialogOpen,
  aiLoading,
  onAIDiagnosis,
  onEditClick,
  onDiagnosisSelect,
  onCompleteWorkup,
  existingPrescription,
  handleViewSavedPrescription
}: DoctorPatientPanelProps) => {
  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
        {currentPatient ? (
          <>
            <PatientDetails />
            {currentPatient && <PatientDocuments />}
            <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
              <PatientActionButtons
                onAIDiagnosis={onAIDiagnosis}
                aiLoading={aiLoading}
                onEditClick={onEditClick}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-400">
            <span>Select a patient from the queue to view details</span>
          </div>
        )}
      </div>
      {aiDiagnosis && aiDiagnosis.diagnoses?.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
          <DifferentialDiagnosisSelector
            diagnoses={aiDiagnosis.diagnoses}
            selectedDiagnosis={singleSelectedDiagnosis}
            onSelect={onDiagnosisSelect}
          />
        </div>
      )}
      {singleSelectedDiagnosis && (
        <DiagnosisBasedFlow
          selectedDiagnosis={singleSelectedDiagnosis}
          prescriptionData={prescriptionData}
          workupData={workupData}
          onCompleteWorkup={onCompleteWorkup}
        />
      )}
      {currentPatient && currentPatient.status === "completed" && existingPrescription && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-100 shadow-sm text-center">
          <h3 className="text-lg font-semibold text-green-700">Consultation Completed</h3>
          <p className="text-green-600 mb-4">This patient's consultation has been completed and a prescription has been issued.</p>
          <Button
            onClick={handleViewSavedPrescription}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 mx-auto"
          >
            <FileText className="h-4 w-4" />
            View & Download Prescription
          </Button>
        </div>
      )}
      {currentPatient && (
        <PrescriptionPreviewModal
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
          prescriptionData={existingPrescription || {}}
          currentPatientId={currentPatient.id}
        />
      )}
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

export default DoctorPatientPanel;
