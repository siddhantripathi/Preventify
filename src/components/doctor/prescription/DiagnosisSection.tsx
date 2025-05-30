
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface DiagnosisSectionProps {
  diagnoses: { name: string; summary?: string }[] | string[];
}

const DiagnosisSection = ({ diagnoses }: DiagnosisSectionProps) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // Ensure diagnoses is always an array
  const diagnosesArray = Array.isArray(diagnoses) ? diagnoses : [];

  // Allow old format: string[] or [{name,summary}]
  const getName = (diag: any) => (typeof diag === "string" ? diag : diag?.name);
  const getSummary = (diag: any) => (typeof diag === "string" ? "" : diag?.summary);

  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs sm:text-sm font-medium text-gray-500">Diagnosis</h3>
      <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
        {diagnosesArray.map((diagnosis: any, index: number) => (
          <div key={index} className="relative flex items-center">
            <Badge variant="outline" className="bg-medical-primary/10 text-medical-primary text-xs">
              {getName(diagnosis)}
            </Badge>
            {getSummary(diagnosis) && (
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-medical-primary focus:outline-none"
                tabIndex={0}
                onClick={() => setOpenIdx(openIdx === index ? null : index)}
              >
                <Info className="w-3.5 h-3.5" aria-label="Show info" />
              </button>
            )}
            {openIdx === index && (
              <div className="absolute z-20 left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-3 text-xs text-gray-700">
                {getSummary(diagnosis)}
                <button
                  className="absolute top-1 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setOpenIdx(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagnosisSection;
