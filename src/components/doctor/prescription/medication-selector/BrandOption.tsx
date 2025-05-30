
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Brand } from '@/types/formulary';
import { CommandItem } from '@/components/ui/command';

interface BrandOptionProps {
  brand: Brand;
  isSelected: boolean;
  onSelect: () => void;
}

const BrandOption = ({ brand, isSelected, onSelect }: BrandOptionProps) => (
  <CommandItem value={brand.brand_name} onSelect={onSelect}>
    <Check
      className={cn(
        "mr-2 h-4 w-4",
        isSelected ? "opacity-100" : "opacity-0"
      )}
    />
    {brand.brand_name}
  </CommandItem>
);

export default BrandOption;
