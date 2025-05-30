
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Diagnosis {
  name: string;
  summary?: string;
  probability?: number;
  icdCode?: string;
  workup?: string[];
}

interface Props {
  diagnoses: Diagnosis[];
  selectedDiagnosis: Diagnosis | null;
  onSelect: (diagnosis: Diagnosis) => void;
}

const DifferentialDiagnosisSelector = ({
  diagnoses,
  selectedDiagnosis,
  onSelect,
}: Props) => {
  if (!diagnoses || diagnoses.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic py-6">
        No AI generated differential diagnosis yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 text-base mb-4">
        Select the most likely diagnosis from the AI-generated list:
      </h3>
      <RadioGroup
        value={selectedDiagnosis?.name || ""}
        onValueChange={val => {
          const diagnosis = diagnoses.find(d => d.name === val);
          if (diagnosis) onSelect(diagnosis);
        }}
        className="w-full flex flex-col gap-3"
      >
        {diagnoses.map((diag, i) => {
          // Calculate a color based on probability
          const probPercentage = diag.probability ? Math.round(diag.probability * 100) : 0;
          let borderColor = "border-gray-200";
          let bgColor = "bg-white";
          
          if (selectedDiagnosis?.name === diag.name) {
            borderColor = "border-medical-primary";
            bgColor = "bg-medical-primary/10";
          } else if (probPercentage > 70) {
            borderColor = "border-green-200";
            bgColor = "bg-green-50";
          } else if (probPercentage > 40) {
            borderColor = "border-yellow-200";
            bgColor = "bg-yellow-50";
          }
          
          return (
            <div
              key={i}
              className={`flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-md border-2 transition-colors cursor-pointer ${borderColor} ${bgColor}`}
              onClick={() => onSelect(diag)}
            >
              <div className="flex flex-row items-center gap-3 w-full">
                <RadioGroupItem value={diag.name} className="mt-0.5" />
                <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2">
                  <span className="font-medium">{diag.name}</span>
                  <div className="flex flex-wrap gap-2">
                    {diag.icdCode && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        ICD: {diag.icdCode}
                      </Badge>
                    )}
                    {diag.probability !== undefined && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          probPercentage > 70 ? "bg-green-100 text-green-800" : 
                          probPercentage > 40 ? "bg-yellow-100 text-yellow-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {probPercentage}% probability
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {diag.summary && (
                <div className="text-sm text-gray-700 mt-3 sm:mt-2 sm:ml-8 p-2 bg-white/70 rounded border border-gray-100 w-full sm:w-auto">
                  {diag.summary}
                </div>
              )}
              
              {diag.workup && diag.workup.length > 0 && (
                <div className="mt-3 sm:mt-0 sm:ml-8 w-full sm:w-auto">
                  <p className="text-xs font-medium text-gray-500 mb-1">Recommended Tests:</p>
                  <div className="flex flex-wrap gap-1">
                    {diag.workup.map((test, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                        {test}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default DifferentialDiagnosisSelector;
