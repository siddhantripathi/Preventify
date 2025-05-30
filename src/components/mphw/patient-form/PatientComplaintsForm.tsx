
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface PatientComplaintsFormProps {
  control: Control<any>;
}

const PatientComplaintsForm = ({ control }: PatientComplaintsFormProps) => {
  return (
    <div className="space-y-4 pt-4">
      <FormField
        control={control}
        name="complaints"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chief Complaints</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter patient's complaints"
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="history"
        render={({ field }) => (
          <FormItem>
            <FormLabel>History</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter patient's medical history"
                className="min-h-[100px]"
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

export default PatientComplaintsForm;
