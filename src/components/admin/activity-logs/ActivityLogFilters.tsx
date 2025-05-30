
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityLogFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  actionFilter: string;
  setActionFilter: (value: string) => void;
  resourceFilter: string;
  setResourceFilter: (value: string) => void;
}

const ActivityLogFilters = ({
  searchTerm,
  setSearchTerm,
  actionFilter,
  setActionFilter,
  resourceFilter,
  setResourceFilter,
}: ActivityLogFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row mt-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={actionFilter} onValueChange={setActionFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          <SelectItem value="login">Login</SelectItem>
          <SelectItem value="logout">Logout</SelectItem>
          <SelectItem value="create">Create</SelectItem>
          <SelectItem value="update">Update</SelectItem>
          <SelectItem value="delete">Delete</SelectItem>
          <SelectItem value="view">View</SelectItem>
        </SelectContent>
      </Select>
      <Select value={resourceFilter} onValueChange={setResourceFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by resource" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All resources</SelectItem>
          <SelectItem value="patient">Patients</SelectItem>
          <SelectItem value="prescription">Prescriptions</SelectItem>
          <SelectItem value="user">Users</SelectItem>
          <SelectItem value="location">Locations</SelectItem>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="formulary">Formulary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActivityLogFilters;
