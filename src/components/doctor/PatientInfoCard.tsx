import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PatientEditForm from "./PatientEditForm";
import { Patient } from "@/types";
import { format } from "date-fns";

interface PatientInfoCardProps {
  patient: Patient;
}

const PatientInfoCard = ({ patient }: PatientInfoCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-medical-primary" />
            Patient Information
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit patient</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h3 className="text-lg sm:text-xl font-medium">{patient.name}</h3>
            <Badge
              variant="outline"
              className={
                patient.status === "completed"
                  ? "bg-medical-success/10 text-medical-success"
                  : patient.status === "in-progress"
                  ? "bg-medical-warning/10 text-medical-warning"
                  : "bg-medical-accent/10 text-medical-accent"
              }
            >
              {patient.status === "completed"
                ? "Completed"
                : patient.status === "in-progress"
                ? "In Progress"
                : "Waiting"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
            <div>
              <span className="text-gray-500">Age:</span> {patient.age} years
            </div>
            <div>
              <span className="text-gray-500">Gender:</span>{" "}
              {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
            </div>
            <div>
              <span className="text-gray-500">UHID:</span> {patient.uhid}
            </div>
            <div>
              <span className="text-gray-500">Registered:</span>{" "}
              {format(new Date(patient.createdAt), "PPp")}
            </div>
          </div>
        </div>
      </CardContent>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Patient Information</DialogTitle>
          </DialogHeader>
          <PatientEditForm 
            patient={patient} 
            onClose={() => setEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PatientInfoCard;
