
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2 } from "lucide-react";
import { FREQUENCY_OPTIONS, DURATION_OPTIONS } from "./constants/medicationOptions";
import MedicationSelector from './MedicationSelector';

interface MedicationRowProps {
  medication: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    isInFormulary?: boolean;
  };
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onDelete: (index: number) => void;
  onMedicationSelect: (index: number, details: { name: string; dosage: string; instructions: string }) => void;
  suggestion: string | null;
  isPreview?: boolean;
}

const MedicationRow = ({
  medication,
  index,
  onUpdate,
  onDelete,
  onMedicationSelect,
  suggestion,
  isPreview = false
}: MedicationRowProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-start border-b pb-4">
      <div className="md:col-span-1">
        <Label htmlFor={`medicationName-${index}`} className="font-medium">Name</Label>
        {!isPreview ? (
          <MedicationSelector
            value={medication.name}
            onChange={(value) => onUpdate(index, "name", value)}
            onDetailsSelected={(details) => onMedicationSelect(index, details)}
          />
        ) : (
          <Input
            type="text"
            id={`medicationName-${index}`}
            value={medication.name}
            className="mt-1"
            readOnly
          />
        )}
        {!isPreview && !medication.isInFormulary && medication.name && (
          <Alert className="mt-2 py-2 bg-red-50 border-red-200">
            <AlertDescription className="text-xs text-red-600">
              Not in formulary. {suggestion ? (
                <span>Consider: <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-blue-600 hover:underline"
                  onClick={() => onUpdate(index, "name", suggestion)}
                >
                  {suggestion}
                </Button></span>
              ) : "Please select an alternative."}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="md:col-span-1">
        <Label htmlFor={`medicationDosage-${index}`} className="font-medium">Dosage</Label>
        <Input
          type="text"
          id={`medicationDosage-${index}`}
          value={medication.dosage}
          onChange={(e) => onUpdate(index, "dosage", e.target.value)}
          readOnly={isPreview}
          className="mt-1"
        />
      </div>

      <div className="md:col-span-1">
        <Label htmlFor={`medicationFrequency-${index}`} className="font-medium">Frequency</Label>
        {!isPreview ? (
          <Select
            value={medication.frequency}
            onValueChange={(value) => onUpdate(index, "frequency", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            value={medication.frequency}
            readOnly
            className="mt-1"
          />
        )}
      </div>

      <div className="md:col-span-1">
        <Label htmlFor={`medicationDuration-${index}`} className="font-medium">Duration</Label>
        {!isPreview ? (
          <Select
            value={medication.duration}
            onValueChange={(value) => onUpdate(index, "duration", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            value={medication.duration}
            readOnly
            className="mt-1"
          />
        )}
      </div>

      <div className="md:col-span-1">
        <Label htmlFor={`medicationInstructions-${index}`} className="font-medium">Instructions</Label>
        <Input
          type="text"
          id={`medicationInstructions-${index}`}
          value={medication.instructions}
          onChange={(e) => onUpdate(index, "instructions", e.target.value)}
          readOnly={isPreview}
          className="mt-1"
        />
      </div>

      {!isPreview && (
        <div className="md:col-span-1 flex items-end justify-center">
          <Button
            variant="outline"
            size="icon"
            className="text-destructive mt-6"
            onClick={() => onDelete(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MedicationRow;
