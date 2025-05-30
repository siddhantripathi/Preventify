
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorDashboardSummary from "./DoctorDashboardSummary";
import PatientList from "@/components/doctor/PatientList";
import CompletedPatientsList from "../CompletedPatientsList";

interface PatientTabViewProps {
  activeTab: "dashboard" | "queue" | "completed";
  onTabChange: (value: "dashboard" | "queue" | "completed") => void;
  onSelectPatient: (patient: any) => void;
}

const PatientTabView = ({ activeTab, onTabChange, onSelectPatient }: PatientTabViewProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as "dashboard" | "queue" | "completed")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="queue">Patient Queue</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <DoctorDashboardSummary />
      </TabsContent>
      <TabsContent value="queue">
        <PatientList onSelectPatient={onSelectPatient} showCompleted={false} />
      </TabsContent>
      <TabsContent value="completed">
        <CompletedPatientsList onSelectPatient={onSelectPatient} />
      </TabsContent>
    </Tabs>
  );
};

export default PatientTabView;
