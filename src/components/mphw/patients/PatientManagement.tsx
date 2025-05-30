
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatient } from "@/contexts/PatientContext";
import { useDoctors } from "@/hooks/useDoctors";
import { useToast } from "@/components/ui/use-toast";
import { Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisitTag } from "../PatientTags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import the new component files
import PatientTable from "./PatientTable";
import DocumentUpload from "./DocumentUpload";
import PatientDetailsDialog from "./PatientDetailsDialog";
import RevisitPatientDialog from "./RevisitPatientDialog";
import PatientEditForm from "../PatientEditForm";

const PatientManagement = () => {
  const { patients, queuedPatients, prescriptions, addPatient } = usePatient();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [revisitDialog, setRevisitDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [pastVisitDialog, setPastVisitDialog] = useState(false);
  const [selectedTag, setSelectedTag] = useState<VisitTag>("consultation");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get actual doctors from the database
  const { doctors, loading: loadingDoctors } = useDoctors();

  const handleRevisit = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedTag("consultation");
    setSelectedDoctor("");
    setRevisitDialog(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditDialog(true);
  };

  const handleViewPastVisit = (patient: Patient) => {
    setSelectedPatient(patient);
    setPastVisitDialog(true);
  };

  const handleTagSelect = (tag: VisitTag) => {
    setSelectedTag(tag);
  };

  const handleDoctorSelect = (value: string) => {
    setSelectedDoctor(value);
  };

  const addToQueue = async () => {
    if (!selectedPatient || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor for the revisit",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Adding patient to queue:", {
        patient: selectedPatient,
        doctor: selectedDoctor,
        tag: selectedTag,
      });

      // Create a new patient entry with the same info but new status and visit type
      addPatient({
        name: selectedPatient.name,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        uhid: selectedPatient.uhid,
        locationId: selectedPatient.locationId,
        doctorId: selectedDoctor,
        visitTag: selectedTag,
        vitals: selectedPatient.vitals,
        history: selectedPatient.history,
        complaints: "", // Empty complaints for revisit, will be filled by MPHW
        mobile: selectedPatient.mobile, // Preserve mobile number if present
      });

      toast({
        title: "Patient Added to Queue",
        description: `${selectedPatient.name} has been added to the queue for a revisit.`,
      });

      setRevisitDialog(false);
    } catch (error) {
      console.error("Error adding patient to queue:", error);
      toast({
        title: "Error",
        description: "Failed to add patient to queue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for the "Register New Patient" button
  const handleRegisterNewPatient = () => {
    // Navigate to MPHW Dashboard and set the tab to new-patient
    navigate("/mphw", { state: { activeTab: "new-patient" } });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Patient Management</span>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRegisterNewPatient}
            >
              <UserPlus className="h-4 w-4" /> Register New Patient
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all-patients">
            <TabsList className="mb-4">
              <TabsTrigger value="all-patients">All Patients</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="all-patients">
              <PatientTable
                patients={patients}
                queuedPatients={queuedPatients}
                onEdit={handleEdit}
                onRevisit={handleRevisit}
                onViewPastVisit={handleViewPastVisit}
              />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentUpload />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs for patient actions */}
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

      {/* Dialog for Patient Edit */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <PatientEditForm patient={selectedPatient} onClose={() => setEditDialog(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Past Visit Details */}
      <PatientDetailsDialog
        open={pastVisitDialog}
        onOpenChange={setPastVisitDialog}
        patient={selectedPatient}
        prescriptions={prescriptions}
      />
    </div>
  );
};

export default PatientManagement;
