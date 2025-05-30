
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { usePatient } from "@/contexts/PatientContext";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { VisitTag } from "./PatientTags";
import { generatePatientId } from "@/services/patientService";

// Import the new components
import PatientFormHeader from "./patient-form/PatientFormHeader";
import PatientBasicInfo from "./patient-form/PatientBasicInfo";
import PatientFormTabs from "./patient-form/PatientFormTabs";
import PatientFormSubmit from "./patient-form/PatientFormSubmit";

// Define form schema with Zod
const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
  age: z.coerce
    .number()
    .min(0, {
      message: "Age must be a positive number.",
    })
    .max(120, {
      message: "Age cannot exceed 120 years.",
    }),
  gender: z.enum(["male", "female", "other"]),
  mobile: z.string().optional(),
  doctorId: z.string().min(1, {
    message: "Please select a doctor.",
  }),
  complaints: z.string().optional(),
  history: z.string().optional(),
  hr: z.coerce.number().optional(),
  bp: z.string().optional(),
  rr: z.coerce.number().optional(),
  tp: z.coerce.number().optional(),
  spo2: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
});

const PatientForm = ({ locationId }: { locationId: string }) => {
  const { addPatient } = usePatient();
  const { toast } = useToast();
  const [visitTag, setVisitTag] = useState<VisitTag>("consultation");
  const [submitting, setSubmitting] = useState(false);
  const [patientId, setPatientId] = useState<string>("");

  // Generate patient ID when component mounts
  useEffect(() => {
    const fetchPatientId = async () => {
      const id = await generatePatientId();
      setPatientId(id);
    };
    fetchPatientId();
  }, []);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: undefined,
      gender: "male",
      mobile: "",
      doctorId: "",
      complaints: "",
      history: "",
      hr: 0,
      bp: "0/0",
      rr: 0,
      tp: 0,
      spo2: 0,
      weight: undefined,
      height: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    try {
      const patient = addPatient({
        name: values.name,
        age: values.age,
        gender: values.gender,
        mobile: values.mobile,
        uhid: patientId,
        locationId: locationId,
        doctorId: values.doctorId,
        visitTag: visitTag,
        complaints: values.complaints || "",
        history: values.history || "",
        vitals: {
          hr: values.hr || 0,
          bp: values.bp || "0/0",
          rr: values.rr || 0,
          tp: values.tp || 0,
          spo2: values.spo2 || 0,
          weight: values.weight,
          height: values.height,
        },
      });

      toast({
        title: "Patient added to queue",
        description: `${values.name} has been registered and added to the queue.`,
      });

      // Reset form
      form.reset();
      // Generate a new patient ID for the next patient
      const newId = await generatePatientId();
      setPatientId(newId);
    } catch (error: any) {
      toast({
        title: "Failed to register patient",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle visit tag selection
  const handleTagSelect = (tag: VisitTag) => {
    setVisitTag(tag);
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
      <PatientFormHeader patientId={patientId} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PatientBasicInfo 
            control={form.control} 
            locationId={locationId} 
            onTagSelect={handleTagSelect} 
            visitTag={visitTag}
          />
          
          <PatientFormTabs control={form.control} />
          
          <PatientFormSubmit submitting={submitting} />
        </form>
      </Form>
    </div>
  );
};

export default PatientForm;
