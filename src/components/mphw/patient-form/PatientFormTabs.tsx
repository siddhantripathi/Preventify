
import React from "react";
import { Control } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientComplaintsForm from "./PatientComplaintsForm";
import PatientVitalsForm from "./PatientVitalsForm";

interface PatientFormTabsProps {
  control: Control<any>;
}

const PatientFormTabs = ({ control }: PatientFormTabsProps) => {
  return (
    <Tabs defaultValue="complaints" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="complaints">Complaints</TabsTrigger>
        <TabsTrigger value="vitals">Vitals</TabsTrigger>
      </TabsList>
      <TabsContent value="complaints">
        <PatientComplaintsForm control={control} />
      </TabsContent>
      <TabsContent value="vitals">
        <PatientVitalsForm control={control} />
      </TabsContent>
    </Tabs>
  );
};

export default PatientFormTabs;
