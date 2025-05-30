
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ClinicalAssessmentInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ClinicalAssessmentInput = ({ value, onChange }: ClinicalAssessmentInputProps) => {
  return (
    <div>
      <Label htmlFor="clinicalAssessment">Clinical Assessment</Label>
      <Textarea
        id="clinicalAssessment"
        placeholder="Enter clinical assessment notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px]"
      />
    </div>
  );
};

export default ClinicalAssessmentInput;
