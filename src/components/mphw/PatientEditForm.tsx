
import React, { useState, useEffect } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Patient } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type PatientEditFormProps = {
  patient: Patient;
  onClose: () => void;
};

const patientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  age: z.number().min(0, {
    message: "Age must be a non-negative number."
  }),
  gender: z.enum(["male", "female", "other"]),
  uhid: z.string().min(2, {
    message: "UHID must be at least 2 characters.",
  }),
  locationId: z.string().optional(),
  doctorId: z.string().optional(),
  visitTag: z.enum(["consultation", "review", "lab-result"]).optional(),
});

const PatientEditForm: React.FC<PatientEditFormProps> = ({ patient, onClose }) => {
  const { updatePatient } = usePatient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    uhid: patient.uhid,
    locationId: patient.locationId || "",
    doctorId: patient.doctorId || "",
    visitTag: patient.visitTag || "consultation",
  });

  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      uhid: patient.uhid,
      locationId: patient.locationId || "",
      doctorId: patient.doctorId || "",
      visitTag: (patient.visitTag as "consultation" | "review" | "lab-result") || "consultation",
    },
  });

  useEffect(() => {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      uhid: patient.uhid,
      locationId: patient.locationId || "",
      doctorId: patient.doctorId || "",
      visitTag: patient.visitTag || "consultation",
    });
  }, [patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (value: "male" | "female" | "other") => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleVisitTagChange = (value: "consultation" | "review" | "lab-result") => {
    setFormData(prev => ({
      ...prev,
      visitTag: value
    }));
  };

  // Fix the age input handling to ensure it's a number
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseInt(value, 10) : 0;
    setFormData(prev => ({
      ...prev,
      age: numValue
    }));
  };

  const onSubmit = async () => {
    const parsedAge = parseInt(formData.age.toString(), 10);

    const updates: Partial<Patient> = {
      ...formData,
      age: parsedAge,
      visitTag: formData.visitTag as "consultation" | "review" | "lab-result",
    };

    const updatedPatient = await updatePatient(patient.id, updates);

    if (updatedPatient) {
      toast({
        title: "Patient Updated",
        description: `${updatedPatient.name}'s information has been updated.`,
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to update patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Patient Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div>
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleAgeChange}
                  placeholder="Age"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </div>

        <div>
          <FormItem>
            <FormLabel>UHID</FormLabel>
            <FormControl>
              <Input
                name="uhid"
                value={formData.uhid}
                onChange={handleInputChange}
                placeholder="UHID"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div>
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup defaultValue={formData.gender} onValueChange={handleGenderChange} className="flex flex-row space-x-4">
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <RadioGroupItem value="male" id="male" />
                  </FormControl>
                  <FormLabel htmlFor="male">Male</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <RadioGroupItem value="female" id="female" />
                  </FormControl>
                  <FormLabel htmlFor="female">Female</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <RadioGroupItem value="other" id="other" />
                  </FormControl>
                  <FormLabel htmlFor="other">Other</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div>
          <FormItem>
            <FormLabel>Visit Type</FormLabel>
            <Select defaultValue={formData.visitTag} onValueChange={handleVisitTagChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="lab-result">Lab Result</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </div>

        <Button type="submit">Update Patient</Button>
      </form>
    </Form>
  );
};

export default PatientEditForm;
