
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AddSaltFormProps {
  onAddSalt: (saltName: string) => Promise<any>;
}

const AddSaltForm = ({ onAddSalt }: AddSaltFormProps) => {
  const [newSaltName, setNewSaltName] = useState("");
  const [addingSalt, setAddingSalt] = useState(false);

  const handleAddSalt = async () => {
    if (!newSaltName.trim()) return;
    setAddingSalt(true);
    await onAddSalt(newSaltName.trim());
    setNewSaltName("");
    setAddingSalt(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Salt</CardTitle>
        <CardDescription>Add a new salt to the formulary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salt-name">Salt Name</Label>
            <Input 
              id="salt-name"
              value={newSaltName} 
              onChange={e => setNewSaltName(e.target.value)}
              placeholder="e.g., Amoxicillin Trihydrate"
            />
          </div>
          <Button 
            onClick={handleAddSalt} 
            disabled={!newSaltName.trim() || addingSalt}
            className="w-full"
          >
            {addingSalt ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {addingSalt ? 'Adding...' : 'Add Salt'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddSaltForm;
