
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { useAdmin } from "@/contexts/AdminContext";
import { usePatient } from "@/contexts/PatientContext";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Building2, 
  Users, 
  UserCheck, 
  FileCheck, 
  Activity 
} from "lucide-react";

const AdminDashboard = () => {
  const { locations, users } = useAdmin();
  const { patients, prescriptions } = usePatient();
  const { user } = useAuth();
  
  const stats = [
    {
      title: "Total Locations",
      value: locations.length,
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      description: "Active hospital locations"
    },
    {
      title: "Total Users",
      value: users.length,
      icon: <Users className="h-5 w-5 text-purple-500" />,
      description: "Doctors, MPHWs, and admins"
    },
    {
      title: "Active Patients",
      value: patients.filter(p => p.status !== 'completed').length,
      icon: <UserCheck className="h-5 w-5 text-green-500" />,
      description: "Patients currently in queue"
    },
    {
      title: "Prescriptions",
      value: prescriptions.length,
      icon: <FileCheck className="h-5 w-5 text-amber-500" />,
      description: "Total prescriptions issued"
    },
    {
      title: "System Health",
      value: "Optimal",
      icon: <Activity className="h-5 w-5 text-green-500" />,
      description: "All systems operational"
    }
  ];
  
  const recentPatients = patients
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
  
  const recentPrescriptions = prescriptions
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);
  
  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening across the system.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Patients</CardTitle>
              <CardDescription>
                Latest patient registrations and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.length > 0 ? (
                  recentPatients.map(patient => (
                    <div key={patient.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          UHID: {patient.uhid} • Status: {patient.status}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(patient.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent patients</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Prescriptions</CardTitle>
              <CardDescription>
                Latest prescriptions issued to patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrescriptions.length > 0 ? (
                  recentPrescriptions.map(prescription => {
                    const patient = patients.find(p => p.id === prescription.patientId);
                    const doctor = users.find(u => u.id === prescription.doctorId);
                    
                    return (
                      <div key={prescription.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{patient?.name || 'Unknown Patient'}</p>
                          <p className="text-sm text-muted-foreground">
                            Dr. {doctor?.name || 'Unknown'} • {prescription.diagnoses[0]}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground">No recent prescriptions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
