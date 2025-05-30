
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ManualEntryFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ManualEntryForm = ({ value, onChange, onSubmit, onCancel }: ManualEntryFormProps) => {
  return (
    <div className="p-2">
      <Label htmlFor="custom-medicine">Enter medicine name:</Label>
      <div className="flex mt-1">
        <Input
          id="custom-medicine"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter custom medicine name"
          className="flex-1"
        />
        <Button 
          className="ml-2" 
          size="sm"
          onClick={onSubmit}
        >
          Add
        </Button>
      </div>
      <Button 
        variant="ghost" 
        className="mt-2 w-full text-xs"
        onClick={onCancel}
      >
        Back to formulary
      </Button>
    </div>
  );
};

export default ManualEntryForm;
