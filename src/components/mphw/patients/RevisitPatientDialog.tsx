
import { useEffect } from "react";
import { Patient } from "@/types";
import { VisitTag } from "@/components/mphw/PatientTags";
import PatientTags from "@/components/mphw/PatientTags";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCircle } from "lucide-react";

interface RevisitPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  doctors: any[];
  loadingDoctors: boolean;
  selectedTag: VisitTag;
  selectedDoctor: string;
  onTagSelect: (tag: VisitTag) => void;
  onDoctorSelect: (value: string) => void;
  onAddToQueue: () => void;
  isSubmitting: boolean;
}

const RevisitPatientDialog = ({
  open,
  onOpenChange,
  patient,
  doctors,
  loadingDoctors,
  selectedTag,
  selectedDoctor,
  onTagSelect,
  onDoctorSelect,
  onAddToQueue,
  isSubmitting,
}: RevisitPatientDialogProps) => {
  // Set default doctor if there's only one available
  useEffect(() => {
    if (doctors.length === 1 && !selectedDoctor && !loadingDoctors) {
      onDoctorSelect(doctors[0].id);
    }
  }, [doctors, selectedDoctor, loadingDoctors, onDoctorSelect]);

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">Patient Revisit</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <UserCircle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
                <span>{patient.age} years</span>
                <span>{patient.gender}</span>
                <span>UHID: {patient.uhid}</span>
              </div>
              {patient.mobile && <p className="text-sm text-gray-500">Mobile: {patient.mobile}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="visit-type" className="text-sm font-medium text-gray-700">
              Visit Type
            </Label>
            <PatientTags 
              patientId={patient.id} 
              onTagSelect={onTagSelect} 
              defaultTag={selectedTag} 
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="doctor" className="text-sm font-medium text-gray-700">
              Assign Doctor
            </Label>
            <Select value={selectedDoctor} onValueChange={onDoctorSelect}>
              <SelectTrigger className="w-full bg-white border-gray-200">
                <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Select doctor"} />
              </SelectTrigger>
              <SelectContent>
                {loadingDoctors ? (
                  <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                ) : doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                      {doctor.specialization ? ` (${doctor.specialization})` : ""}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-doctors" disabled>No doctors available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button 
            onClick={onAddToQueue} 
            disabled={isSubmitting || !selectedDoctor}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? "Adding..." : "Add to Queue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevisitPatientDialog;
