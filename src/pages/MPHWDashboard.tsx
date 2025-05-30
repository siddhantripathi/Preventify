
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PatientForm from "@/components/mphw/PatientForm";
import PatientQueue from "@/components/mphw/PatientQueue";
import PatientManagement from "@/components/mphw/patients/PatientManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MPHWDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("queue");
  const { user } = useAuth();
  
  // Check for activeTab in location state when component mounts or location changes
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state to prevent it from persisting on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Function to switch to the registration tab
  const handleNewPatientClick = () => {
    setActiveTab("new-patient");
  };

  return (
    <Layout requiredRole="mphw">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MPHW Dashboard</h1>
        <p className="text-gray-500">Register new patients and manage the queue</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg bg-gray-100">
          <TabsTrigger 
            id="new-patient-tab" 
            value="new-patient" 
            className="flex gap-2 items-center data-[state=active]:bg-white data-[state=active]:text-primary"
            data-testid="new-patient-tab"
          >
            <UserPlus className="h-4 w-4" /> New Patient
          </TabsTrigger>
          <TabsTrigger 
            value="queue" 
            className="flex gap-2 items-center data-[state=active]:bg-white data-[state=active]:text-primary"
            data-testid="queue-tab"
          >
            <Users className="h-4 w-4" /> Queue
          </TabsTrigger>
          <TabsTrigger 
            value="management" 
            className="flex gap-2 items-center data-[state=active]:bg-white data-[state=active]:text-primary"
            data-testid="management-tab"
          >
            <ClipboardList className="h-4 w-4" /> Patients
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="new-patient">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-medical-primary">
                New Patient Registration
              </h2>
              <p className="text-sm text-gray-500">
                Fill out the form below to register a new patient and add them to the queue
              </p>
            </div>
            <PatientForm locationId={user?.locationIds?.[0] || ''} />
          </TabsContent>
          <TabsContent value="queue">
            <PatientQueue />
          </TabsContent>
          <TabsContent value="management">
            <PatientManagement />
          </TabsContent>
        </div>
      </Tabs>
    </Layout>
  );
};

export default MPHWDashboard;
