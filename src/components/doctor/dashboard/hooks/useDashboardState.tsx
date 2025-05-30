import { useState } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { useToast } from "@/components/ui/use-toast";
import { Diagnosis } from "@/types";
import { generateDiagnosisAndPrescription } from "@/services/ai";
import { useAuth } from "@/contexts/AuthContext";

export const useDashboardState = () => {
  const { currentPatient, setCurrentPatient, getPrescriptionsForPatient, patients, updatePatientStatus, refreshData } = usePatient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"diagnosis" | "workup" | "prescription">("diagnosis");
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Diagnosis[]>([]);
  const [prescriptionData, setPrescriptionData] = useState<any>({
    medications: [],
    advice: [],
    followUp: "",
    workupNotes: {},
    clinicalAssessment: ""
  });
  const [workupData, setWorkupData] = useState<any>({
    parameters: [],
    diagnosisNotes: {},
    clinicalAssessment: ""
  });
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editPatientDialogOpen, setEditPatientDialogOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const { toast } = useToast();

  const [aiDiagnosis, setAiDiagnosis] = useState<null | { diagnoses: any[]; prescription: any }>(null);
  const [singleSelectedDiagnosis, setSingleSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [activePatientTab, setActivePatientTab] = useState<"queue" | "completed" | "dashboard">("dashboard");

  const existingPrescription = currentPatient
    ? getPrescriptionsForPatient(currentPatient.id)[0]
    : undefined;

  const handleAIDiagnosis = async () => {
    if (!currentPatient) {
      toast({
        variant: "destructive",
        title: "No patient selected",
        description: "Select a patient first before using the AI diagnosis."
      });
      return;
    }
    
    // We'll use the user's API key if available, otherwise the system will use the default from .env
    setAiLoading(true);
    setAiDiagnosis(null);

    try {
      console.log('Requesting AI diagnosis for patient:', currentPatient.name);
      const aiResult = await generateDiagnosisAndPrescription(currentPatient, user?.geminiApiKey);
      console.log('AI diagnosis result:', aiResult);

      setAiDiagnosis({
        diagnoses: aiResult.diagnoses,
        prescription: aiResult.prescription
      });

      toast({
        title: "AI Differential Diagnosis Ready!",
        description: "Review AI's top likely conditions and recommendations below."
      });

      setSelectedDiagnoses(aiResult.diagnoses.map((d: any) => ({
        name: d.name,
        description: d.summary,
        probability: d.probability,
        workup: d.workup,
        summary: d.summary
      })));

      setPrescriptionData({
        ...prescriptionData,
        medications: aiResult.prescription.medications || [],
        advice: aiResult.prescription.advice || [],
        followUp: aiResult.prescription.followUp || "",
      });

      setActiveTab("diagnosis");
    } catch (err: any) {
      console.error('AI diagnosis error:', err);
      toast({
        variant: "destructive",
        title: "AI Diagnosis failed",
        description: (err as any)?.message || "Could not get suggestions from AI."
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleDiagnosisSelect = (diagnosis: Diagnosis) => {
    setSingleSelectedDiagnosis(diagnosis);
    setPrescriptionData((prev: any) => ({
      ...prev,
      medications: aiDiagnosis?.prescription?.medications || [],
      advice: aiDiagnosis?.prescription?.advice || [],
      followUp: aiDiagnosis?.prescription?.followUp || "",
    }));
    setActiveTab("workup");
  };

  const handleWorkupComplete = (
    updatedDiagnoses: Diagnosis[], 
    updatedPrescriptionData: any, 
    updatedWorkupData: any
  ) => {
    setSelectedDiagnoses(updatedDiagnoses);
    setPrescriptionData({
      ...updatedPrescriptionData,
      workupNotes: updatedWorkupData.diagnosisNotes,
      clinicalAssessment: updatedWorkupData.clinicalAssessment || ""
    });
    setWorkupData(updatedWorkupData);
    setActiveTab("prescription");
  };

  const handleSelectPatient = (patient: any) => {
    setCurrentPatient(patient);
    setShowFullscreen(true);
  };

  const handleCloseCase = async () => {
    if (!currentPatient) return;
    
    await updatePatientStatus(currentPatient.id, "completed");
    setShowFullscreen(false);
    setCurrentPatient(null);
    setAiDiagnosis(null);
    setSingleSelectedDiagnosis(null);
    
    toast({
      title: "Case Closed",
      description: "The consultation has been closed.",
    });
    
    refreshData();
  };

  const handleSendBackToQueue = async () => {
    if (!currentPatient) return;
    
    await updatePatientStatus(currentPatient.id, "waiting");
    setShowFullscreen(false);
    setCurrentPatient(null);
    
    toast({
      title: "Patient Returned to Queue",
      description: "The patient has been sent back to the waiting queue.",
    });
    
    refreshData();
  };

  return {
    currentPatient,
    activeTab,
    selectedDiagnoses,
    prescriptionData,
    workupData,
    previewModalOpen,
    setPreviewModalOpen,
    editPatientDialogOpen,
    setEditPatientDialogOpen,
    aiLoading,
    aiDiagnosis,
    singleSelectedDiagnosis,
    showFullscreen,
    setShowFullscreen,
    activePatientTab,
    setActivePatientTab,
    existingPrescription,
    handleAIDiagnosis,
    handleDiagnosisSelect,
    handleWorkupComplete,
    handleSelectPatient,
    handleCloseCase,
    handleSendBackToQueue
  };
};
