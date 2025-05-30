
import React from 'react';
import { useFormularyData } from './formulary/useFormularyData';
import { useFormularyCrud } from './formulary/useFormularyCrud';
import { useFormularyCsv } from './formulary/useFormularyCsv';

export const useFormulary = () => {
  const { medications, loading, error, refresh } = useFormularyData();
  const { addMedication, addSalt, addBrand } = useFormularyCrud(refresh);
  const { handleCSVUpload } = useFormularyCsv(refresh);

  return {
    // Data state
    medications,
    loading,
    error,
    refresh,
    
    // CRUD operations
    addMedication,
    addSalt,
    addBrand,
    
    // CSV handling
    handleCSVUpload
  };
};
