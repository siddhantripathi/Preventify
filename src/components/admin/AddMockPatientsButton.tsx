
import React, { useState } from "react";
import { generateMockPatients } from "@/utils/mockPatients";
import { usePatient } from "@/contexts/PatientContext";
import { Button } from "@/components/ui/button";

const AddMockPatientsButton = () => {
  const { addPatient } = usePatient();
  const [isLoading, setIsLoading] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  const handleAddPatients = async () => {
    setIsLoading(true);
    setAddedCount(0);
    const toAdd = generateMockPatients(100);
    for (let i = 0; i < toAdd.length; ++i) {
      await new Promise((resolve) => setTimeout(resolve, 20)); // Prevent UI freeze
      addPatient(toAdd[i]);
      setAddedCount(i + 1);
    }
    setIsLoading(false);
  };

  return (
    <Button onClick={handleAddPatients} disabled={isLoading}>
      {isLoading ? `Adding... (${addedCount}/100)` : "Add 100 Mock Patients"}
    </Button>
  );
};

export default AddMockPatientsButton;
