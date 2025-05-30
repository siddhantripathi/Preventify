
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
import { Brain, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AIMonitoring = () => {
  const { prescriptions } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiagnosis, setFilterDiagnosis] = useState("");
  
  // Get unique diagnoses from all prescriptions
  const allDiagnoses = [...new Set(prescriptions.flatMap(p => p.diagnoses))];
  
  // Filter prescriptions based on search and diagnosis filter
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = !searchTerm || 
      prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiagnosis = !filterDiagnosis || filterDiagnosis === "all" || 
      prescription.diagnoses.includes(filterDiagnosis);
    
    return matchesSearch && matchesDiagnosis;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Monitoring</h1>
          <p className="text-muted-foreground">
            Track and analyze AI-generated diagnoses across the platform.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Diagnostic Performance</CardTitle>
            <CardDescription>
              Monitor AI diagnostics accuracy and usage patterns.
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
              <Select value={filterDiagnosis} onValueChange={setFilterDiagnosis}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by diagnosis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All diagnoses</SelectItem>
                  {allDiagnoses.map(diagnosis => (
                    <SelectItem key={diagnosis} value={diagnosis}>{diagnosis}</SelectItem>
                  ))}
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
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Doctor ID</TableHead>
                      <TableHead>AI Diagnoses</TableHead>
                      <TableHead>Doctor's Selection</TableHead>
                      <TableHead>Match Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => {
                      // In a real app, you would compare AI suggestions to doctor selections
                      // This is a simplified example
                      const matchStatus = Math.random() > 0.5 ? "Matched" : "Modified";
                      
                      return (
                        <TableRow key={prescription.id}>
                          <TableCell>{prescription.patientId}</TableCell>
                          <TableCell>{prescription.doctorId}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Brain size={16} className="text-primary" />
                              <span>{prescription.diagnoses.join(", ")}</span>
                            </div>
                          </TableCell>
                          <TableCell>{prescription.diagnoses.join(", ")}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              matchStatus === 'Matched' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {matchStatus}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(prescription.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No AI diagnoses found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Performance Summary</CardTitle>
            <CardDescription>
              Overall AI diagnostic performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Diagnosis Match Rate</div>
                <div className="text-2xl font-bold mt-1">78%</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Avg. Confidence Score</div>
                <div className="text-2xl font-bold mt-1">82%</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">AI Assisted Cases</div>
                <div className="text-2xl font-bold mt-1">{prescriptions.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AIMonitoring;
