
import { Salt, FormularyMedication } from "@/types/formulary";
import AddSaltForm from "./AddSaltForm";
import AddMedicationForm from "./AddMedicationForm";
import AddBrandForm from "./AddBrandForm";
import CSVUploadForm from "./CSVUploadForm";

interface AddFormsContainerProps {
  medications: FormularyMedication[];
  salts: Salt[];
  onAddSalt: (saltName: string) => Promise<any>;
  onAddMedication: (medName: string, saltId: string | null) => Promise<any>;
  onAddBrand: (brandName: string, medicationId: string) => Promise<any>;
  onCSVUpload?: (data: { salt: string; brand: string }[]) => Promise<void>;
}

const AddFormsContainer = ({ 
  medications, 
  salts,
  onAddSalt,
  onAddMedication,
  onAddBrand,
  onCSVUpload
}: AddFormsContainerProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AddSaltForm onAddSalt={onAddSalt} />
        <AddMedicationForm salts={salts} onAddMedication={onAddMedication} />
        <AddBrandForm medications={medications} onAddBrand={onAddBrand} />
      </div>
      
      {onCSVUpload && (
        <div className="mt-8">
          <CSVUploadForm onCSVUpload={onCSVUpload} />
        </div>
      )}
    </div>
  );
};

export default AddFormsContainer;
