
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FollowUpInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FollowUpInput = ({ value, onChange }: FollowUpInputProps) => {
  return (
    <div>
      <Label htmlFor="followUp">Follow-Up Instructions</Label>
      <Input
        type="text"
        id="followUp"
        placeholder="Enter follow-up instructions"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default FollowUpInput;
