
import React, { useState, useEffect } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { Diagnosis } from '@/types';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Download, Printer } from "lucide-react";
import PrescriptionPreviewModal from './PrescriptionPreviewModal';
// Import refactored components
import ClinicalAssessmentInput from "./prescription/ClinicalAssessmentInput";
import FollowUpInput from "./prescription/FollowUpInput";
import MedicationsEditor from "./prescription/medications-editor/MedicationsEditor";
import AdviceEditor from "./prescription/AdviceEditor";

interface PrescriptionFormProps {
  selectedDiagnoses: Diagnosis[];
  prescriptionData: any;
  workupData: any;
}

const PrescriptionForm = ({ selectedDiagnoses, prescriptionData, workupData }: PrescriptionFormProps) => {
  const [medications, setMedications] = useState<any[]>(prescriptionData.medications || []);
  const [advice, setAdvice] = useState<string[]>([]);
  const [followUpText, setFollowUpText] = useState<string>(prescriptionData.followUp || "");
  const [clinicalAssessment, setClinicalAssessment] = useState<string>(prescriptionData.clinicalAssessment || "");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const { currentPatient, addPrescription } = usePatient();

  useEffect(() => {
    // Handle clinical assessment
    if (prescriptionData.clinicalAssessment) {
      let cleanedAssessment = prescriptionData.clinicalAssessment;
      cleanedAssessment = cleanedAssessment.replace(/\(probability:?\s*\d+%\)/gi, "");
      cleanedAssessment = cleanedAssessment.replace(/This is an AI-generated preliminary assessment\. Please review and modify as needed\./gi, "");
      cleanedAssessment = cleanedAssessment.replace(/\s+/g, " ").trim();
      setClinicalAssessment(cleanedAssessment);
    }
    
    // Handle medications
    if (prescriptionData.medications) {
      setMedications(prescriptionData.medications);
    }
    
    // Handle advice - convert string to array if needed
    if (prescriptionData.advice) {
      if (typeof prescriptionData.advice === 'string') {
        // Split by sentences or commas if it's a string
        const adviceArray = prescriptionData.advice
          .split(/[.,;]/)
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
        setAdvice(adviceArray);
      } else if (Array.isArray(prescriptionData.advice)) {
        setAdvice(prescriptionData.advice);
      } else {
        setAdvice([]);
      }
    } else {
      setAdvice([]);
    }
    
    // Handle follow-up
    if (prescriptionData.followUp) {
      setFollowUpText(prescriptionData.followUp);
    }
  }, [prescriptionData]);

  // Medications handlers
  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const deleteMedication = (index: number) => {
    const newMedications = [...medications];
    newMedications.splice(index, 1);
    setMedications(newMedications);
  };

  // Advice handlers
  const addAdvice = () => {
    setAdvice([...advice, '']);
  };

  const updateAdvice = (index: number, value: string) => {
    const newAdvice = [...advice];
    newAdvice[index] = value;
    setAdvice(newAdvice);
  };

  const deleteAdvice = (index: number) => {
    const newAdvice = [...advice];
    newAdvice.splice(index, 1);
    setAdvice(newAdvice);
  };

  const getCurrentPrescriptionData = () => {
    return {
      patientId: currentPatient?.id,
      locationId: currentPatient?.locationId,
      diagnoses: selectedDiagnoses.map(d => d.name),
      medications: medications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions
      })),
      advice: advice,
      followUp: followUpText,
      workupNotes: workupData.diagnosisNotes,
      workupParameters: workupData.parameters,
      clinicalAssessment: clinicalAssessment
    };
  };

  const savePrescription = async () => {
    if (!currentPatient) return;

    try {
      const prescriptionToSave = getCurrentPrescriptionData();
      const result = await addPrescription(prescriptionToSave);

      if (result) {
        toast({
          title: "Prescription Saved",
          description: "Prescription has been saved successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save prescription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrintPrescription = () => {
    const prescriptionData = getCurrentPrescriptionData();
    setPreviewModalOpen(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleViewAndDownload = () => {
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2 mb-4 justify-between">
        <h2 className="text-xl font-semibold">Prescription Editor</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleViewAndDownload}
          >
            <Download className="h-4 w-4" /> View & Download
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handlePrintPrescription}
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button 
            type="button" 
            onClick={savePrescription}
            className="bg-medical-primary hover:bg-medical-secondary"
          >
            Save Prescription
          </Button>
        </div>
      </div>
      {/* Split two-column inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClinicalAssessmentInput value={clinicalAssessment} onChange={setClinicalAssessment} />
        <FollowUpInput value={followUpText} onChange={setFollowUpText} />
      </div>
      <MedicationsEditor
        medications={medications}
        onAdd={addMedication}
        onUpdate={updateMedication}
        onDelete={deleteMedication}
      />
      <AdviceEditor
        advice={advice}
        onAdd={addAdvice}
        onUpdate={updateAdvice}
        onDelete={deleteAdvice}
      />
      {/* Prescription Preview Modal */}
      {currentPatient && (
        <PrescriptionPreviewModal
          open={previewModalOpen}
          onOpenChange={setPreviewModalOpen}
          prescriptionData={getCurrentPrescriptionData()}
          currentPatientId={currentPatient.id}
        />
      )}
    </div>
  );
};

export default PrescriptionForm;
