
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { usePatient } from "@/contexts/PatientContext";
import { useDoctors } from "@/hooks/useDoctors"; 
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
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const QueueManagement = () => {
  const { queuedPatients, updatePatientStatus, updatePatient } = usePatient();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { toast } = useToast();
  
  // Get actual doctors from the database
  const { doctors, loading: loadingDoctors } = useDoctors();

  // In a real app, you would have location data
  const locations = ["Location 1", "Location 2", "Location 3"];
  
  // Filter patients by location
  const filteredPatients = selectedLocation === "all" 
    ? queuedPatients 
    : queuedPatients.filter(p => p.locationId === selectedLocation);

  // Calculate wait time (in a real app, this would be based on actual timestamps)
  const getWaitTime = (patient: any) => {
    const waitMinutes = patient.status === 'waiting' 
      ? Math.floor(Math.random() * 60) + 5 
      : Math.floor(Math.random() * 30) + 2;
      
    return `${waitMinutes} min`;
  };

  // Get the assigned doctor name based on the doctorId
  const getAssignedDoctor = (patient: any) => {
    if (patient.doctorId) {
      const doctor = doctors.find(d => d.id === patient.doctorId);
      return doctor ? doctor.name : "Unknown";
    }
    return "Unassigned";
  };

  const handleAssignDoctor = (patientId: string, doctorId: string) => {
    try {
      // Update patient with assigned doctor and change status to in-progress
      updatePatient(patientId, { 
        doctorId,
        status: 'in-progress'
      });
      
      toast({
        title: "Doctor Assigned",
        description: "Patient has been assigned to a doctor successfully",
      });
    } catch (error) {
      console.error(`Error assigning doctor: ${error}`);
      toast({
        title: "Assignment Failed",
        description: "There was an error assigning the doctor. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Queue Management</h1>
          <p className="text-muted-foreground">
            Monitor active patient queues and optimize wait times.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <span className="text-sm">Waiting: {queuedPatients.filter(p => p.status === 'waiting').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-400"></div>
              <span className="text-sm">In Progress: {queuedPatients.filter(p => p.status === 'in-progress').length}</span>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Patient Queues</CardTitle>
            <CardDescription>
              View and manage patient queues across locations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredPatients.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Wait Time</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => {
                      const assignedDoctor = getAssignedDoctor(patient);
                      
                      return (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{patient.name}</div>
                              <div className="text-xs text-muted-foreground">{patient.age} / {patient.gender}</div>
                            </div>
                          </TableCell>
                          <TableCell>{patient.locationId}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              patient.status === 'waiting' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {patient.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{getWaitTime(patient)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{assignedDoctor}</TableCell>
                          <TableCell>
                            {patient.status === 'waiting' && (
                              <Select
                                onValueChange={(doctorId) => handleAssignDoctor(patient.id, doctorId)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Assign" />
                                </SelectTrigger>
                                <SelectContent>
                                  {loadingDoctors ? (
                                    <SelectItem value="loading" disabled>Loading doctors...</SelectItem>
                                  ) : doctors.length > 0 ? (
                                    doctors.map((doctor) => (
                                      <SelectItem key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                        {doctor.specialization ? ` (${doctor.specialization})` : ''}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="none" disabled>No doctors available</SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                            {patient.status === 'in-progress' && (
                              <Button
                                variant="outline" 
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => updatePatientStatus(patient.id, 'completed')}
                              >
                                <ArrowRightCircle size={14} />
                                <span>Complete</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No patients in queue.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue Summary</CardTitle>
            <CardDescription>
              Queue statistics and performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Avg. Wait Time</div>
                <div className="text-2xl font-bold mt-1">23 min</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Longest Wait</div>
                <div className="text-2xl font-bold mt-1">47 min</div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Patients per Hour</div>
                <div className="text-2xl font-bold mt-1">4.8</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default QueueManagement;
