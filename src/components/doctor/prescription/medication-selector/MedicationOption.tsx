
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormularyMedication } from '@/types/formulary';
import { CommandItem } from '@/components/ui/command';

interface MedicationOptionProps {
  medication: FormularyMedication;
  isSelected: boolean;
  onSelect: () => void;
}

const MedicationOption = ({ medication, isSelected, onSelect }: MedicationOptionProps) => (
  <CommandItem value={medication.generic_name} onSelect={onSelect}>
    <Check
      className={cn(
        "mr-2 h-4 w-4",
        isSelected ? "opacity-100" : "opacity-0"
      )}
    />
    {medication.generic_name}
    {medication.salt?.salt_name && (
      <span className="ml-2 text-muted-foreground">({medication.salt.salt_name})</span>
    )}
  </CommandItem>
);

export default MedicationOption;
