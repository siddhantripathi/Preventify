import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { usePatient } from "@/contexts/PatientContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Eye, Mail, Printer, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PrescriptionsManagement = () => {
  const { prescriptions, patients } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Filter prescriptions based on search term and filter
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = !searchTerm || 
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // In a real app, you would have status tracking for prescriptions
    return matchesSearch;
  });

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ["ID", "Patient", "Doctor", "Location", "Diagnoses", "Medications", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredPrescriptions.map(prescription => [
        prescription.id,
        prescription.patientId,
        prescription.doctorId,
        prescription.locationId,
        prescription.diagnoses.join(";"),
        prescription.medications.length,
        new Date(prescription.createdAt).toLocaleDateString()
      ].join(","))
    ].join("\n");
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "prescriptions.csv");
    link.click();
  };

  // Helper function to get patient name from ID
  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : patientId;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prescriptions Management</h1>
            <p className="text-muted-foreground">
              Monitor and manage prescriptions across all locations.
            </p>
          </div>
          <Button onClick={handleExportCSV} className="flex items-center gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
            <CardDescription>
              View, search, and analyze prescription data.
            </CardDescription>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mt-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient or doctor..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All prescriptions</SelectItem>
                  <SelectItem value="downloaded">Downloaded</SelectItem>
                  <SelectItem value="emailed">Emailed</SelectItem>
                  <SelectItem value="printed">Printed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPrescriptions.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Diagnoses</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{getPatientName(prescription.patientId)}</TableCell>
                        <TableCell>{prescription.doctorId}</TableCell>
                        <TableCell>{prescription.locationId}</TableCell>
                        <TableCell>{prescription.diagnoses.join(", ")}</TableCell>
                        <TableCell>{prescription.medications.length} medications</TableCell>
                        <TableCell>{new Date(prescription.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="View">
                              <Eye size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" title="Print">
                              <Printer size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" title="Email">
                              <Mail size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No prescriptions found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Metrics</CardTitle>
            <CardDescription>
              Prescription compliance with Indian guidelines (ICMR, IAP).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">ICMR Compliance</div>
                <div className="text-2xl font-bold mt-1">94%</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">IAP Compliance</div>
                <div className="text-2xl font-bold mt-1">92%</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Digital Signatures</div>
                <div className="text-2xl font-bold mt-1">100%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PrescriptionsManagement;
