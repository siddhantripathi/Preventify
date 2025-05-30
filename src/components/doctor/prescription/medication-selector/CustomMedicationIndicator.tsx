
import React from 'react';
import { Edit } from 'lucide-react';

interface CustomMedicationIndicatorProps {
  isCustom: boolean;
}

const CustomMedicationIndicator = ({ isCustom }: CustomMedicationIndicatorProps) => {
  if (!isCustom) return null;
  
  return (
    <div className="text-xs text-amber-600 flex items-center">
      <Edit className="h-3 w-3 mr-1" /> Custom medication (not in formulary)
    </div>
  );
};

export default CustomMedicationIndicator;
