import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { usePatient } from "@/contexts/PatientContext";
import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import PatientSearchBar from "@/components/admin/patients/PatientSearchBar";
import PatientsTable from "@/components/admin/patients/PatientsTable";
import PatientsActionBar from "@/components/admin/patients/PatientsActionBar";

const PatientsManagement = () => {
  const { patients, prescriptions, loading, error } = usePatient();
  const { locations } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.uhid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    try {
      if (filteredPatients.length === 0) {
        toast({
          title: "No data to export",
          description: "There are no patients matching your search criteria",
          variant: "destructive"
        });
        return;
      }
      
      // Create CSV content
      const headers = ["Name", "Age", "Gender", "UHID", "Location", "Status"];
      const csvContent = [
        headers.join(","),
        ...filteredPatients.map(patient => {
          const locationName = locations.find(loc => loc.id === patient.locationId)?.name || patient.locationId;
          return [
            patient.name,
            patient.age,
            patient.gender,
            patient.uhid,
            locationName,
            patient.status
          ].join(",");
        })
      ].join("\n");
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "patients.csv");
      link.click();
      
      toast({
        title: "Success",
        description: "Patients data exported successfully"
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Error",
        description: "Failed to export patients data",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p>Loading patient data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)]">
          <p className="text-red-500">Error loading patient data: {error.message}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PatientsActionBar 
          onExportCSV={handleExportCSV} 
          disabled={filteredPatients.length === 0} 
        />
        
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>
              View, search, and export patient data.
            </CardDescription>
            <PatientSearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
            />
          </CardHeader>
          <CardContent>
            <PatientsTable 
              patients={filteredPatients} 
              prescriptions={prescriptions} 
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PatientsManagement;
