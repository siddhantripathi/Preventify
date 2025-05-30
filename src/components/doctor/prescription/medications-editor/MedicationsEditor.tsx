
import React from 'react';
import MedicationsContainer from './MedicationsContainer';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  isInFormulary?: boolean;
}

interface MedicationsEditorProps {
  medications: Medication[];
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onDelete: (index: number) => void;
  isPreview?: boolean;
}

const MedicationsEditor = ({ medications, onAdd, onUpdate, onDelete, isPreview = false }: MedicationsEditorProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Medications</h3>
      <MedicationsContainer 
        medications={medications}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isPreview={isPreview}
      />
    </div>
  );
};

export default MedicationsEditor;
