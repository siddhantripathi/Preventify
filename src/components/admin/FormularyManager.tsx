
import { useState } from "react";
import { useFormulary } from "@/hooks/useFormulary";
import { Salt } from "@/types/formulary";
import { Loader2 } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// Import our component files
import MedicationsTable from "./formulary/MedicationsTable";
import SaltsTable from "./formulary/SaltsTable";
import BrandsTable from "./formulary/BrandsTable";
import AddFormsContainer from "./formulary/AddFormsContainer";

const FormularyManager = () => {
  const { 
    medications, 
    loading, 
    error, 
    refresh, 
    addMedication, 
    addSalt, 
    addBrand,
    handleCSVUpload
  } = useFormulary();

  // Extract all salts from medications for easier access
  const allSalts = medications.reduce((salts: Salt[], med) => {
    if (med.salt && !salts.some(s => s.id === med.salt?.id)) {
      salts.push(med.salt);
    }
    return salts;
  }, []);

  // Count medications, salts, and brands for the summary
  const saltCount = allSalts.length;
  const medicationCount = medications.length;
  const brandCount = medications.reduce((count, med) => count + (med.brands?.length || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading formulary data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4 border border-destructive/20 rounded-md bg-destructive/5">
        Error loading formulary data: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Medications</h3>
          <p className="text-3xl font-bold text-blue-900">{medicationCount}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Salts</h3>
          <p className="text-3xl font-bold text-green-900">{saltCount}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-800">Brands</h3>
          <p className="text-3xl font-bold text-purple-900">{brandCount}</p>
        </div>
      </div>

      <Tabs defaultValue="medications">
        <TabsList className="mb-4">
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="salts">Salts</TabsTrigger>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications">
          <MedicationsTable medications={medications} />
        </TabsContent>
        
        <TabsContent value="salts">
          <SaltsTable salts={allSalts} medications={medications} />
        </TabsContent>
        
        <TabsContent value="brands">
          <BrandsTable medications={medications} />
        </TabsContent>
        
        <TabsContent value="add">
          <AddFormsContainer 
            medications={medications}
            salts={allSalts}
            onAddSalt={addSalt}
            onAddMedication={addMedication}
            onAddBrand={addBrand}
            onCSVUpload={handleCSVUpload}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormularyManager;
