
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import AddMockPatientsButton from "@/components/admin/AddMockPatientsButton";

interface PatientsActionBarProps {
  onExportCSV: () => void;
  disabled: boolean;
}

const PatientsActionBar = ({ onExportCSV, disabled }: PatientsActionBarProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients Management</h1>
        <p className="text-muted-foreground">
          View and manage patient records across all locations.
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onExportCSV} 
          className="flex items-center gap-2"
          disabled={disabled}
        >
          <Download size={16} />
          Export CSV
        </Button>
        <AddMockPatientsButton />
      </div>
    </div>
  );
};

export default PatientsActionBar;
