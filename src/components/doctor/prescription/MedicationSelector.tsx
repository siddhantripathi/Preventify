
import { useState, useEffect } from 'react';
import { useFormulary } from '@/hooks/useFormulary';
import { FormularyMedication, Brand } from '@/types/formulary';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import FormularyList from './medication-selector/FormularyList';
import ManualEntryForm from './medication-selector/ManualEntryForm';
import CustomMedicationIndicator from './medication-selector/CustomMedicationIndicator';

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
  const [manualEntry, setManualEntry] = useState(false);
  const [customMedicine, setCustomMedicine] = useState('');

  // Check if medication is custom (not in formulary)
  const isCustomMedication = value && !medications.some(med => 
    med.generic_name === value || med.brands?.some(b => b.brand_name === value)
  );

  // When a medication + brand is selected, update the name
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

      // If callback provided, send additional details
      if (onDetailsSelected) {
        onDetailsSelected({
          name: displayName,
          dosage: '',
          instructions: ''
        });
      }
    }
  }, [selected, selectedBrand, onChange, onDetailsSelected]);

  // Handle manual entry submission
  const handleManualEntrySubmit = () => {
    if (customMedicine.trim()) {
      onChange(customMedicine.trim());
      
      if (onDetailsSelected) {
        onDetailsSelected({
          name: customMedicine.trim(),
          dosage: '',
          instructions: ''
        });
      }
      
      setOpen(false);
    }
  };

  const handleSelectMedication = (medication: FormularyMedication) => {
    setSelected(medication);
    if (!medication.brands || medication.brands.length === 0) {
      setOpen(false);
    } else {
      setSelectedBrand(null);
    }
  };

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setOpen(false);
  };

  if (loading) {
    return <Input value="Loading medications..." disabled />;
  }

  return (
    <div className="space-y-2">
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
              <CommandEmpty>
                No medications found. 
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs text-blue-600 hover:underline ml-1"
                  onClick={() => setManualEntry(true)}
                >
                  Add custom medicine
                </Button>
              </CommandEmpty>
              
              {manualEntry ? (
                <ManualEntryForm
                  value={customMedicine}
                  onChange={setCustomMedicine}
                  onSubmit={handleManualEntrySubmit}
                  onCancel={() => setManualEntry(false)}
                />
              ) : (
                <FormularyList
                  medications={medications}
                  selected={selected}
                  selectedBrand={selectedBrand}
                  onSelectMedication={handleSelectMedication}
                  onSelectBrand={handleSelectBrand}
                  onAddCustom={() => setManualEntry(true)}
                />
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CustomMedicationIndicator isCustom={isCustomMedication} />
    </div>
  );
};

export default MedicationSelector;
