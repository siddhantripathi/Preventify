
import { Button } from "@/components/ui/button";
import { SearchCheck } from "lucide-react";

interface Props {
  currentPatient: any;
  aiLoading: boolean;
  onAIDiagnosis: () => void;
}

const AIDiagnosisPanel = ({ currentPatient, aiLoading, onAIDiagnosis }: Props) => (
  <div className="flex justify-between items-center mb-4">
    <div>
      <span className="text-lg font-semibold text-gray-800">{currentPatient.name}</span>
    </div>
    <Button
      onClick={onAIDiagnosis}
      disabled={aiLoading}
      className="bg-primary hover:bg-primary/90 flex gap-2"
    >
      <SearchCheck className="h-4 w-4" />
      {aiLoading ? "Getting AI Diagnosis..." : "Get Differential Diagnosis (AI)"}
    </Button>
  </div>
);

export default AIDiagnosisPanel;
