import { useState } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Save, X } from "lucide-react";

interface PatientEditFormProps {
  patient: Patient;
  onClose: () => void;
}

const PatientEditForm = ({ patient, onClose }: PatientEditFormProps) => {
  const { updatePatient } = usePatient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vitals: {
      hr: patient.vitals.hr,
      bp: patient.vitals.bp,
      rr: patient.vitals.rr,
      tp: patient.vitals.tp,
      spo2: patient.vitals.spo2,
      weight: patient.vitals.weight || 0,
      height: patient.vitals.height || 0
    },
    complaints: patient.complaints || "",
    history: patient.history || "",
    doctorNotes: patient.doctorNotes || ""
  });

  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [name]: name === "bp" ? value : Number(value)
      }
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updatePatient(patient.id, {
        vitals: formData.vitals,
        complaints: formData.complaints,
        history: formData.history,
        doctorNotes: formData.doctorNotes
      });
      
      toast({
        title: "Patient Updated",
        description: `${patient.name}'s information has been updated.`
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient information.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Update Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Vital Signs</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div>
                <Label htmlFor="hr">Heart Rate (bpm)</Label>
                <Input
                  id="hr"
                  name="hr"
                  type="number"
                  value={formData.vitals.hr}
                  onChange={handleVitalsChange}
                />
              </div>
              <div>
                <Label htmlFor="bp">Blood Pressure</Label>
                <Input
                  id="bp"
                  name="bp"
                  value={formData.vitals.bp}
                  onChange={handleVitalsChange}
                  placeholder="120/80"
                />
              </div>
              <div>
                <Label htmlFor="rr">Respiratory Rate</Label>
                <Input
                  id="rr"
                  name="rr"
                  type="number"
                  value={formData.vitals.rr}
                  onChange={handleVitalsChange}
                />
              </div>
              <div>
                <Label htmlFor="tp">Temperature (°F)</Label>
                <Input
                  id="tp"
                  name="tp"
                  type="number"
                  step="0.1"
                  value={formData.vitals.tp}
                  onChange={handleVitalsChange}
                />
              </div>
              <div>
                <Label htmlFor="spo2">SpO2 (%)</Label>
                <Input
                  id="spo2"
                  name="spo2"
                  type="number"
                  value={formData.vitals.spo2}
                  onChange={handleVitalsChange}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.vitals.weight}
                  onChange={handleVitalsChange}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.vitals.height}
                  onChange={handleVitalsChange}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="complaints">Chief Complaints</Label>
            <Textarea
              id="complaints"
              name="complaints"
              value={formData.complaints}
              onChange={handleTextChange}
              placeholder="Enter patient's chief complaints"
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="history">Patient History</Label>
            <Textarea
              id="history"
              name="history"
              value={formData.history}
              onChange={handleTextChange}
              placeholder="Enter patient's medical history"
              className="min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="doctorNotes">Doctor's Notes</Label>
            <Textarea
              id="doctorNotes"
              name="doctorNotes"
              value={formData.doctorNotes}
              onChange={handleTextChange}
              placeholder="Add notes before diagnosis"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2 sticky bottom-0 pt-4 bg-white border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-medical-primary hover:bg-medical-secondary">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientEditForm;
