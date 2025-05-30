
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PatientVitalsFormProps {
  control: Control<any>;
}

const PatientVitalsForm = ({ control }: PatientVitalsFormProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
      <FormField
        control={control}
        name="hr"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Heart Rate (bpm)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="HR"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="bp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blood Pressure (mmHg)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. 120/80"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="rr"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Respiratory Rate</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="RR"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Temperature (°F)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Temp"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="spo2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SPO2 (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="SPO2"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight (kg)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Weight"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height (cm)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Height"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PatientVitalsForm;
