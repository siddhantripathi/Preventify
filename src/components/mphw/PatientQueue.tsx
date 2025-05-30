
import { useState, useEffect } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { VisitTag } from "./PatientTags";
import { useDoctors } from "@/hooks/useDoctors";
import PatientQueueList from "./queue/PatientQueueList";
import CompletedConsultations from "./queue/CompletedConsultations";
import { useAuth } from "@/contexts/AuthContext";
import RevisitPatientDialog from "./patients/RevisitPatientDialog";

const PatientQueue = () => {
  const { patients, loading, refreshData, addPatient, updatePatient } = usePatient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { doctors, loading: loadingDoctors } = useDoctors(user?.locationIds?.[0] || "");
  const [queuedPatients, setQueuedPatients] = useState<any[]>([]);
  const [completedPatients, setCompletedPatients] = useState<any[]>([]);
  const [revisitDialog, setRevisitDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<VisitTag>("consultation");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Filter patients based on status
    if (patients && patients.length > 0) {
      // Only show patients from the MPHW's assigned location
      const locationId = user?.locationIds?.[0];
      const filteredPatients = locationId 
        ? patients.filter(p => p.locationId === locationId)
        : patients;
      
      const queued = filteredPatients.filter(p => p.status === 'waiting' || p.status === 'in-progress');
      const completed = filteredPatients.filter(p => p.status === 'completed');
      
      setQueuedPatients(queued);
      setCompletedPatients(completed);
    }
  }, [patients, user]);

  // Refresh patient data when component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleAddToQueue = (patientId: string) => {
    // Navigate to edit patient form with revisit flag
    navigate(`/mphw/patients/${patientId}/edit`, { 
      state: { 
        isRevisit: true,
        returnToQueue: true
      } 
    });
  };

  const handleRevisit = (patient: any) => {
    setSelectedPatient(patient);
    setSelectedTag("consultation");
    setSelectedDoctor("");
    setRevisitDialog(true);
  };

  const handleTagSelect = (tag: VisitTag) => {
    setSelectedTag(tag);
  };

  const handleDoctorSelect = (value: string) => {
    setSelectedDoctor(value);
  };

  const addToQueue = () => {
    if (!selectedPatient || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor for the revisit",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new patient entry with the same info but new status and visit type
      addPatient({
        name: selectedPatient.name,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        uhid: selectedPatient.uhid,
        locationId: selectedPatient.locationId || user?.locationIds?.[0] || "",
        doctorId: selectedDoctor,
        visitTag: selectedTag,
        vitals: selectedPatient.vitals,
        history: selectedPatient.history,
        complaints: "",  // Empty complaints for revisit, will be filled by MPHW
        mobile: selectedPatient.mobile, // Preserve mobile number if present
      });
      
      toast({
        title: "Patient Added to Queue",
        description: `${selectedPatient.name} has been added to the queue for a revisit.`
      });
      
      setRevisitDialog(false);
    } catch (error) {
      console.error("Error adding patient to queue:", error);
      toast({
        title: "Error",
        description: "Failed to add patient to queue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Patient Queue</h2>
        <p className="text-sm text-gray-500">Manage patients waiting for consultation</p>
      </div>
      
      <div className="space-y-8">
        <PatientQueueList 
          patients={queuedPatients} 
          loading={loading} 
          onEdit={handleAddToQueue} 
        />
        
        <CompletedConsultations 
          patients={completedPatients} 
          loading={loading} 
          onRevisit={handleRevisit} 
        />
      </div>

      <RevisitPatientDialog 
        open={revisitDialog}
        onOpenChange={setRevisitDialog}
        patient={selectedPatient}
        doctors={doctors}
        loadingDoctors={loadingDoctors}
        selectedTag={selectedTag}
        selectedDoctor={selectedDoctor}
        onTagSelect={handleTagSelect}
        onDoctorSelect={handleDoctorSelect}
        onAddToQueue={addToQueue}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PatientQueue;
