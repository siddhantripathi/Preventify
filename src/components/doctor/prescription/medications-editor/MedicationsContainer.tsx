
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import MedicationRow from './MedicationRow';
import { useFormulary } from '@/hooks/useFormulary';
import { checkFormularyAvailability, getSuggestionForUnavailableMed } from './FormularyChecker';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  isInFormulary?: boolean;
}

interface MedicationsContainerProps {
  medications: Medication[];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onDelete: (index: number) => void;
  isPreview?: boolean;
}

const MedicationsContainer = ({ 
  medications, 
  onAdd, 
  onUpdate, 
  onDelete, 
  isPreview = false 
}: MedicationsContainerProps) => {
  const { medications: formularyMeds } = useFormulary();

  const handleMedicationSelect = (index: number, details: { name: string; dosage: string; instructions: string }) => {
    onUpdate(index, "name", details.name);
    if (details.dosage) onUpdate(index, "dosage", details.dosage);
    if (details.instructions) onUpdate(index, "instructions", details.instructions);
  };

  return (
    <ScrollArea className="h-[300px] rounded-md border">
      <div className="space-y-4 p-4">
        {medications.map((medication, index) => {
          const isAvailable = checkFormularyAvailability(medication.name, formularyMeds);
          const suggestion = !isAvailable && medication.name 
            ? getSuggestionForUnavailableMed(medication.name, formularyMeds) 
            : null;
          
          return (
            <MedicationRow
              key={index}
              medication={{ ...medication, isInFormulary: isAvailable }}
              index={index}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMedicationSelect={handleMedicationSelect}
              suggestion={suggestion}
              isPreview={isPreview}
            />
          );
        })}
        {!isPreview && (
          <Button type="button" variant="secondary" onClick={onAdd} className="mt-4">
            Add Medication
          </Button>
        )}
      </div>
    </ScrollArea>
  );
};

export default MedicationsContainer;
