
import { format } from 'date-fns';
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  User,
  LogIn,
  LogOut,
  FilePlus,
  FileEdit,
  Trash,
  Eye
} from "lucide-react";

export interface ActivityLogItemProps {
  id: string;
  user_id: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';
  resource_type: 'patient' | 'prescription' | 'user' | 'location' | 'system' | 'formulary';
  resource_id: string;
  details: string;
  ip_address?: string;
  created_at: string;
  user_name?: string;
  user_role?: string;
}

const ActivityLogItem = ({ log }: { log: ActivityLogItemProps }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn className="h-4 w-4" />;
      case 'logout': return <LogOut className="h-4 w-4" />;
      case 'create': return <FilePlus className="h-4 w-4" />;
      case 'update': return <FileEdit className="h-4 w-4" />;
      case 'delete': return <Trash className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      default: return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return "bg-green-100 text-green-800";
      case 'logout': return "bg-orange-100 text-orange-800";
      case 'create': return "bg-blue-100 text-blue-800";
      case 'update': return "bg-purple-100 text-purple-800";
      case 'delete': return "bg-red-100 text-red-800";
      case 'view': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'patient': return <User className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <TableRow key={log.id}>
      <TableCell className="font-mono text-xs">
        {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium">{log.user_name || 'Unknown'}</div>
            <div className="text-xs text-gray-500">{log.user_role || 'Unknown'}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`${getActionColor(log.action)} flex items-center gap-1`}>
          {getActionIcon(log.action)}
          {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getResourceIcon(log.resource_type)}
          <div>
            <div className="font-medium">
              {log.resource_type.charAt(0).toUpperCase() + log.resource_type.slice(1)}
            </div>
            <div className="text-xs text-gray-500">{log.resource_id}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="max-w-xs truncate">
        {log.details}
      </TableCell>
    </TableRow>
  );
};

export default ActivityLogItem;
