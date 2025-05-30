
import React, { useState } from "react";
import PatientDetails from "@/components/doctor/PatientDetails";
import PatientDocuments from "@/components/doctor/PatientDocuments";
import DifferentialDiagnosisSelector from "@/components/doctor/DifferentialDiagnosisSelector";
import DiagnosisBasedFlow from "@/components/doctor/DiagnosisBasedFlow";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Edit, X, ArrowLeft } from "lucide-react";
import PrescriptionPreviewModal from "@/components/doctor/PrescriptionPreviewModal";
import { usePatient } from "@/contexts/PatientContext";

interface PatientDetailWorkflowProps {
  currentPatient: any;
  aiDiagnosis: any;
  singleSelectedDiagnosis: any;
  prescriptionData: any;
  workupData: any;
  onDiagnosisSelect: (diagnosis: any) => void;
  onCompleteWorkup: (d: any, p: any, w: any) => void;
  onCloseCase: () => void;
  onSendBackToQueue: () => void;
  onEditPatient: () => void;
  onAIDiagnosis: () => void;
  aiLoading: boolean;
}

const PatientDetailWorkflow = ({
  currentPatient,
  aiDiagnosis,
  singleSelectedDiagnosis,
  prescriptionData,
  workupData,
  onDiagnosisSelect,
  onCompleteWorkup,
  onCloseCase,
  onSendBackToQueue,
  onEditPatient,
  onAIDiagnosis,
  aiLoading
}: PatientDetailWorkflowProps) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const { getPrescriptionsForPatient } = usePatient();
  
  const existingPrescription = currentPatient ? getPrescriptionsForPatient(currentPatient.id)[0] : null;
  
  if (!currentPatient) {
    return (
      <div className="flex items-center justify-center h-60 text-gray-500">
        No patient selected
      </div>
    );
  }
  
  // Determine if case is already completed
  const isCompleted = currentPatient.status === "completed";
  
  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 min-h-[60vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <span>Patient Consultation</span>
          {isCompleted && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </h1>
        
        <div className="flex gap-2">
          {!isCompleted && (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={onEditPatient}
              >
                <Edit className="h-4 w-4" />
                Edit Details
              </Button>
              
              <Button
                onClick={onAIDiagnosis}
                disabled={aiLoading}
                className="flex items-center gap-2 bg-medical-primary hover:bg-medical-secondary"
              >
                <Stethoscope className="h-4 w-4" />
                {aiLoading ? "Processing..." : "Get AI Diagnosis"}
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="details" className="text-base">
            Patient Details
          </TabsTrigger>
          <TabsTrigger value="diagnosis" disabled={!aiDiagnosis} className="text-base">
            Diagnosis
          </TabsTrigger>
          <TabsTrigger value="prescription" disabled={!singleSelectedDiagnosis} className="text-base">
            Prescription
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6 mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-medical-primary border-b pb-2">Patient Information</h2>
              <PatientDetails />
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-medical-primary border-b pb-2">Patient Documents</h2>
              <PatientDocuments />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="diagnosis" className="space-y-4 mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {aiDiagnosis && aiDiagnosis.diagnoses?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-medical-primary border-b pb-2 mb-4">Differential Diagnosis</h2>
              <DifferentialDiagnosisSelector
                diagnoses={aiDiagnosis.diagnoses}
                selectedDiagnosis={singleSelectedDiagnosis}
                onSelect={onDiagnosisSelect}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="prescription" className="space-y-4 mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {singleSelectedDiagnosis && (
            <div>
              <h2 className="text-lg font-semibold text-medical-primary border-b pb-2 mb-4">Prescription Details</h2>
              <DiagnosisBasedFlow
                selectedDiagnosis={singleSelectedDiagnosis}
                prescriptionData={prescriptionData}
                workupData={workupData}
                onCompleteWorkup={onCompleteWorkup}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {isCompleted && existingPrescription && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 shadow-sm">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Consultation Completed</h3>
          <p className="text-green-600 mb-4">This patient's consultation has been completed and a prescription has been issued.</p>
          <Button
            onClick={() => setPreviewModalOpen(true)}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            View Prescription
          </Button>
        </div>
      )}
      
      {!isCompleted && (
        <div className="mt-auto pt-4 border-t flex flex-wrap gap-3 justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onSendBackToQueue}
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Queue
          </Button>
          
          <Button
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            onClick={onCloseCase}
          >
            <X className="h-4 w-4" />
            Close Case
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
    </div>
  );
};

export default PatientDetailWorkflow;
