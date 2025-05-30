
import { FormularyMedication } from '@/types/formulary';

export const checkFormularyAvailability = (
  medName: string, 
  formularyMeds: FormularyMedication[]
): boolean => {
  if (!medName) return false;
  
  const normalizedName = medName.toLowerCase();
  return formularyMeds.some(med => 
    med.generic_name.toLowerCase() === normalizedName ||
    med.brands?.some(brand => brand.brand_name.toLowerCase() === normalizedName)
  );
};

export const getSuggestionForUnavailableMed = (
  medName: string, 
  formularyMeds: FormularyMedication[]
): string | null => {
  const medNameLower = medName.toLowerCase();
  const suggestions = formularyMeds.filter(med => 
    med.generic_name.toLowerCase().includes(medNameLower.substring(0, 4)) ||
    (med.salt?.salt_name?.toLowerCase().includes(medNameLower.substring(0, 4)))
  );
  
  if (suggestions.length > 0) {
    const firstSuggestion = suggestions[0];
    return firstSuggestion.brands && firstSuggestion.brands.length > 0
      ? `${firstSuggestion.generic_name} (${firstSuggestion.brands[0].brand_name})`
      : firstSuggestion.generic_name;
  }
  
  return null;
};
