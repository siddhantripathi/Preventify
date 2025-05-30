
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";

interface AdviceEditorProps {
  advice: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
}

const AdviceEditor = ({ advice, onAdd, onUpdate, onDelete }: AdviceEditorProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Advice</h3>
      <ScrollArea className="h-[300px] rounded-md border">
        <div className="space-y-2 p-4">
          {advice.map((adviceItem, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-4">
                <Label htmlFor={`advice-${index}`}>Advice {index + 1}</Label>
                <Input
                  type="text"
                  id={`advice-${index}`}
                  value={adviceItem}
                  onChange={(e) => onUpdate(index, e.target.value)}
                />
              </div>
              <div className="flex items-end justify-center">
                <Button variant="outline" size="icon" className="text-destructive" onClick={() => onDelete(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={onAdd}>
            Add Advice
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdviceEditor;
