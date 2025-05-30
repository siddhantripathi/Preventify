
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Salt } from "@/types/formulary";

interface AddMedicationFormProps {
  salts: Salt[];
  onAddMedication: (medName: string, saltId: string | null) => Promise<any>;
}

const AddMedicationForm = ({ salts, onAddMedication }: AddMedicationFormProps) => {
  const [newMedName, setNewMedName] = useState("");
  const [selectedSaltId, setSelectedSaltId] = useState<string | null>(null);
  const [addingMed, setAddingMed] = useState(false);

  const handleAddMedication = async () => {
    if (!newMedName.trim()) return;
    setAddingMed(true);
    await onAddMedication(newMedName.trim(), selectedSaltId);
    setNewMedName("");
    setSelectedSaltId(null);
    setAddingMed(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Medication</CardTitle>
        <CardDescription>Add a new generic medication</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="med-name">Generic Name</Label>
            <Input 
              id="med-name"
              value={newMedName} 
              onChange={e => setNewMedName(e.target.value)}
              placeholder="e.g., Amoxicillin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salt-select">Salt (Optional)</Label>
            <Select value={selectedSaltId || "none"} onValueChange={setSelectedSaltId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a salt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {salts.map(salt => (
                  <SelectItem key={salt.id} value={salt.id}>
                    {salt.salt_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAddMedication} 
            disabled={!newMedName.trim() || addingMed}
            className="w-full"
          >
            {addingMed ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {addingMed ? 'Adding...' : 'Add Medication'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddMedicationForm;
