
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { ActivityLogItemProps } from "./ActivityLogItem";

interface ActivityLogActionsProps {
  logs: ActivityLogItemProps[];
  onRefresh: () => void;
  isLoading: boolean;
}

const ActivityLogActions = ({ logs, onRefresh, isLoading }: ActivityLogActionsProps) => {
  
  const handleExportCSV = () => {
    const headers = ["Date", "User", "Role", "Action", "Resource Type", "Resource ID", "Details"];
    const csvContent = [
      headers.join(","),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.user_name || 'Unknown',
        log.user_role || 'Unknown',
        log.action,
        log.resource_type,
        log.resource_id,
        `"${log.details?.replace(/"/g, '""') || ''}"`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
        title="Refresh logs"
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      <Button 
        onClick={handleExportCSV} 
        className="flex items-center gap-2"
        disabled={logs.length === 0 || isLoading}
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};

export default ActivityLogActions;
