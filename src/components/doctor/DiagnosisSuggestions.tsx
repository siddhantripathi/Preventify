
import React, { useState, useEffect } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { Diagnosis } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { diagnosisCodes, formatICDCode } from "@/utils/icdCodes";

interface DiagnosisSuggestionsProps {
  onDiagnosisSelect: (diagnoses: Diagnosis[], prescriptionData: any) => void;
}

// Adding a local internal type that includes id
interface DiagnosisWithId extends Diagnosis {
  id?: string;
}

const DiagnosisSuggestions = ({ onDiagnosisSelect }: DiagnosisSuggestionsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<DiagnosisWithId[]>([]);
  const [diagnosisNotes, setDiagnosisNotes] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentPatient } = usePatient();

  useEffect(() => {
    // Simulate fetching diagnoses from an API
    const fetchDiagnoses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace this with your actual API call
        // Simulated API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSelectedDiagnoses([]);
        setDiagnosisNotes({});
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load diagnoses.");
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  // Generate a unique key for each diagnosis
  const getDiagnosisKey = (diagnosis: DiagnosisWithId): string => {
    return diagnosis.id || diagnosis.name;
  };

  const sampleDiagnoses = [
    { 
      name: "Common Cold", 
      description: "Acute viral infection of the upper respiratory tract.",
      probability: 0.8,
      workup: ["Rest", "Fluids", "Antipyretics if fever present"],
      summary: "Upper respiratory viral infection"
    },
    { 
      name: "Influenza", 
      description: "A contagious respiratory illness caused by influenza viruses.",
      probability: 0.7,
      workup: ["Rest", "Hydration", "Antipyretics", "Antivirals if within 48 hours"],
      summary: "Viral respiratory infection"
    },
    { 
      name: "Pneumonia", 
      description: "Infection that inflames air sacs in one or both lungs.",
      probability: 0.6,
      workup: ["Chest X-ray", "Blood cultures", "Sputum culture", "Antibiotics"],
      summary: "Lung infection"
    },
    { 
      name: "Asthma", 
      description: "A chronic disease that affects your airways.",
      probability: 0.5,
      workup: ["Pulmonary function tests", "Peak flow monitoring", "Inhaled corticosteroids"],
      summary: "Chronic airway inflammation"
    },
    { 
      name: "Hypertension", 
      description: "High blood pressure.",
      probability: 0.4,
      workup: ["Regular BP monitoring", "Diet modification", "Exercise", "Medications if needed"],
      summary: "Elevated blood pressure"
    },
    { 
      name: "Diabetes", 
      description: "A chronic metabolic disease characterized by elevated levels of blood glucose.",
      probability: 0.3,
      workup: ["Blood glucose monitoring", "HbA1c", "Kidney function", "Eye exam"],
      summary: "Metabolic disorder with elevated blood glucose"
    },
  ];

  const filteredDiagnoses = sampleDiagnoses.filter((diagnosis) =>
    diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDiagnosisToggle = (diagnosis: DiagnosisWithId) => {
    const diagnosisKey = getDiagnosisKey(diagnosis);
    const isSelected = selectedDiagnoses.some((d) => getDiagnosisKey(d) === diagnosisKey);

    if (isSelected) {
      setSelectedDiagnoses(selectedDiagnoses.filter((d) => getDiagnosisKey(d) !== diagnosisKey));
      const { [diagnosisKey]: removedNote, ...remainingNotes } = diagnosisNotes;
      setDiagnosisNotes(remainingNotes);
    } else {
      setSelectedDiagnoses([...selectedDiagnoses, diagnosis]);
    }
  };

  const handleNoteChange = (diagnosisKey: string, note: string) => {
    setDiagnosisNotes((prevNotes) => ({
      ...prevNotes,
      [diagnosisKey]: note,
    }));
  };

  const handleContinue = () => {
    const diagnosesWithNotes = selectedDiagnoses.map((diagnosis) => {
      const diagnosisKey = getDiagnosisKey(diagnosis);
      return {
        ...diagnosis,
        additionalNotes: diagnosisNotes[diagnosisKey] || "",
      };
    });

    // Prepare prescription data (replace with actual data if needed)
    const prescriptionData = {
      medications: [],
      advice: [],
      followUp: "",
      workupNotes: {},
      clinicalAssessment: "",
    };

    onDiagnosisSelect(diagnosesWithNotes as Diagnosis[], prescriptionData);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm border border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-gray-800">Select Diagnoses</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search diagnoses..."
              className="pl-8 bg-white border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading diagnosis suggestions...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 py-8 text-red-500">
              <AlertCircle size={16} />
              <p>Error loading diagnoses: {error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDiagnoses.map((diagnosis) => {
                  const diagnosisKey = diagnosis.name;
                  const isSelected = selectedDiagnoses.some(
                    (d) => getDiagnosisKey(d) === diagnosisKey
                  );
                  const matchingIcd = diagnosisCodes.find(
                    code => code.description.toLowerCase().includes(diagnosis.name.toLowerCase())
                  );
                  const icdDisplay = matchingIcd ? `${matchingIcd.code}` : "";

                  return (
                    <div
                      key={diagnosisKey}
                      className={`p-3 rounded-lg border transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`diagnosis-${diagnosisKey}`}
                          checked={isSelected}
                          onCheckedChange={() => handleDiagnosisToggle(diagnosis)}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`diagnosis-${diagnosisKey}`}
                              className="font-medium text-gray-800 cursor-pointer"
                            >
                              {diagnosis.name}
                            </Label>
                            {icdDisplay && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {icdDisplay}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {diagnosis.description}
                          </p>
                          {isSelected && (
                            <Textarea
                              placeholder="Add notes for this diagnosis..."
                              className="mt-2 text-sm h-20 resize-none bg-white"
                              value={diagnosisNotes[diagnosisKey] || ""}
                              onChange={(e) => handleNoteChange(diagnosisKey, e.target.value)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Continue button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleContinue}
                  disabled={selectedDiagnoses.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Continue with Selected Diagnoses
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisSuggestions;
