
import React from "react";
import { Button } from "@/components/ui/button";
import { Stethoscope, Edit } from "lucide-react";

interface Props {
  onAIDiagnosis: () => void;
  aiLoading: boolean;
  onEditClick: () => void;
}

const PatientActionButtons = ({ onAIDiagnosis, aiLoading, onEditClick }: Props) => (
  <div className="flex flex-row gap-2 w-full md:w-auto justify-end md:justify-start">
    <Button
      onClick={onAIDiagnosis}
      disabled={aiLoading}
      className="flex gap-2 rounded-full bg-medical-primary hover:bg-medical-secondary flex-1 md:flex-none"
    >
      <Stethoscope className="h-4 w-4" />
      {aiLoading ? "Getting Diagnosis..." : "Get Differential Diagnosis"}
    </Button>
    <Button
      variant="outline"
      className="flex gap-2 rounded-full flex-1 md:flex-none"
      onClick={onEditClick}
    >
      <Edit className="h-4 w-4" />
      Edit Details
    </Button>
  </div>
);

export default PatientActionButtons;
