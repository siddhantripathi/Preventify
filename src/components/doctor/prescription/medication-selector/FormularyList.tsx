
import React from 'react';
import { CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormularyMedication, Brand } from '@/types/formulary';
import MedicationOption from './MedicationOption';
import BrandOption from './BrandOption';

interface FormularyListProps {
  medications: FormularyMedication[];
  selected: FormularyMedication | null;
  selectedBrand: Brand | null;
  onSelectMedication: (medication: FormularyMedication) => void;
  onSelectBrand: (brand: Brand) => void;
  onAddCustom: () => void;
}

const FormularyList = ({
  medications, 
  selected, 
  selectedBrand, 
  onSelectMedication, 
  onSelectBrand, 
  onAddCustom
}: FormularyListProps) => {
  return (
    <>
      <CommandGroup heading="Medications">
        {medications.map(med => (
          <MedicationOption
            key={med.id}
            medication={med}
            isSelected={selected?.id === med.id}
            onSelect={() => onSelectMedication(med)}
          />
        ))}
      </CommandGroup>
      
      {selected && selected.brands && selected.brands.length > 0 && (
        <CommandGroup heading="Brands">
          {selected.brands.map(brand => (
            <BrandOption
              key={brand.id}
              brand={brand}
              isSelected={selectedBrand?.id === brand.id}
              onSelect={() => onSelectBrand(brand)}
            />
          ))}
        </CommandGroup>
      )}
      
      <CommandSeparator />
      <CommandGroup>
        <CommandItem
          onSelect={onAddCustom}
          className="text-blue-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add custom medication
        </CommandItem>
      </CommandGroup>
    </>
  );
};

export default FormularyList;
