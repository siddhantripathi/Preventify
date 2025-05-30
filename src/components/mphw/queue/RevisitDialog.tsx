
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PatientTags, { VisitTag } from "../PatientTags";

type RevisitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: any;
  doctors: any[];
  loadingDoctors: boolean;
  onTagSelect: (tag: VisitTag) => void;
  selectedTag: VisitTag;
  selectedDoctor: string;
  onDoctorSelect: (value: string) => void;
  onAddToQueue: () => void;
};

const RevisitDialog = ({
  open,
  onOpenChange,
  patient,
  doctors,
  loadingDoctors,
  onTagSelect,
  selectedTag,
  selectedDoctor,
  onDoctorSelect,
  onAddToQueue
}: RevisitDialogProps) => {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Patient Revisit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.age} years, {patient.gender}, UHID: {patient.uhid}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Visit Type</Label>
            <PatientTags patientId={patient.id} onTagSelect={onTagSelect} defaultTag={selectedTag} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor">Assign Doctor</Label>
            <Select value={selectedDoctor} onValueChange={onDoctorSelect}>
              <SelectTrigger>
                <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Select doctor"} />
              </SelectTrigger>
              <SelectContent>
                {doctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}{doctor.specialization ? ` (${doctor.specialization})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddToQueue}>Add to Queue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RevisitDialog;
