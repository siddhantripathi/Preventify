
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PatientSearchBar = ({ searchTerm, setSearchTerm }: PatientSearchBarProps) => {
  return (
    <div className="relative w-full max-w-sm mt-2">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name or UHID..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default PatientSearchBar;
