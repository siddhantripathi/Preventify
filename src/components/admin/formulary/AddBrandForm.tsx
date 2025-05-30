
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
import { FormularyMedication } from "@/types/formulary";

interface AddBrandFormProps {
  medications: FormularyMedication[];
  onAddBrand: (brandName: string, medicationId: string) => Promise<any>;
}

const AddBrandForm = ({ medications, onAddBrand }: AddBrandFormProps) => {
  const [newBrandName, setNewBrandName] = useState("");
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const [addingBrand, setAddingBrand] = useState(false);

  const handleAddBrand = async () => {
    if (!newBrandName.trim() || !selectedMedId) return;
    setAddingBrand(true);
    await onAddBrand(newBrandName.trim(), selectedMedId);
    setNewBrandName("");
    setSelectedMedId(null);
    setAddingBrand(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Brand</CardTitle>
        <CardDescription>Add a new brand name medication</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input 
              id="brand-name"
              value={newBrandName} 
              onChange={e => setNewBrandName(e.target.value)}
              placeholder="e.g., Amoxil"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="med-select">Generic Medication</Label>
            <Select value={selectedMedId || ""} onValueChange={setSelectedMedId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a medication" />
              </SelectTrigger>
              <SelectContent>
                {medications.map(med => (
                  <SelectItem key={med.id} value={med.id}>
                    {med.generic_name}
                    {med.salt?.salt_name && ` (${med.salt.salt_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAddBrand} 
            disabled={!newBrandName.trim() || !selectedMedId || addingBrand}
            className="w-full"
          >
            {addingBrand ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {addingBrand ? 'Adding...' : 'Add Brand'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddBrandForm;
