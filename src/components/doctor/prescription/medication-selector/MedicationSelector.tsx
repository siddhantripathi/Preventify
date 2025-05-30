
import React, { useState, useEffect } from 'react';
import { useFormulary } from '@/hooks/useFormulary';
import { FormularyMedication, Brand } from '@/types/formulary';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import MedicationOption from './MedicationOption';
import BrandOption from './BrandOption';

interface MedicationSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onDetailsSelected?: (details: { 
    name: string; 
    dosage: string; 
    instructions: string;
  }) => void;
}

const MedicationSelector = ({ value, onChange, onDetailsSelected }: MedicationSelectorProps) => {
  const { medications, loading } = useFormulary();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FormularyMedication | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    if (selected) {
      let displayName = selected.generic_name;
      
      if (selected.salt?.salt_name) {
        displayName += ` (${selected.salt.salt_name})`;
      }
      
      if (selectedBrand) {
        displayName += ` [${selectedBrand.brand_name}]`;
      }
      
      onChange(displayName);

      if (onDetailsSelected) {
        onDetailsSelected({
          name: displayName,
          dosage: '',
          instructions: ''
        });
      }
    }
  }, [selected, selectedBrand, onChange, onDetailsSelected]);

  if (loading) {
    return <Input value="Loading medications..." disabled />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select medication..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start" side="bottom" sideOffset={5}>
        <Command>
          <CommandInput placeholder="Search medications..." />
          <CommandList>
            <CommandEmpty>No medications found.</CommandEmpty>
            <CommandGroup heading="Medications">
              {medications.map(med => (
                <MedicationOption
                  key={med.id}
                  medication={med}
                  isSelected={selected?.id === med.id}
                  onSelect={() => {
                    setSelected(med);
                    if (med.brands && med.brands.length > 0) {
                      setSelectedBrand(null);
                    } else {
                      setOpen(false);
                    }
                  }}
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
                    onSelect={() => {
                      setSelectedBrand(brand);
                      setOpen(false);
                    }}
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MedicationSelector;
