import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/integrations/firebase/config";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ActivityLogFilters from "@/components/admin/activity-logs/ActivityLogFilters";
import ActivityLogTable from "@/components/admin/activity-logs/ActivityLogTable";
import ActivityLogActions from "@/components/admin/activity-logs/ActivityLogActions";
import { ActivityLogItemProps } from "@/components/admin/activity-logs/ActivityLogItem";

const LOGS_PER_PAGE = 10;

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [logs, setLogs] = useState<ActivityLogItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Custom function to fetch activity logs with user data
  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      // Fetch logs from Firestore
      const logsQuery = query(
        collection(db, 'activity_logs'),
        orderBy('created_at', 'desc')
      );
      const logsSnapshot = await getDocs(logsQuery);
      
      // Fetch users to join with logs
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      
      // Create a map of user data for efficient lookup
      const usersMap = new Map();
      usersSnapshot.forEach(doc => {
        usersMap.set(doc.id, {
          id: doc.id,
          name: doc.data().name,
          role: doc.data().role
        });
      });
      
      // Join the data manually
      const combinedLogs: ActivityLogItemProps[] = [];
      logsSnapshot.forEach(doc => {
        const logData = doc.data();
        const user = usersMap.get(logData.user_id);
        
        combinedLogs.push({
          id: doc.id,
          user_id: logData.user_id,
          user_name: user?.name || 'Unknown',
          user_role: user?.role || 'Unknown',
          action: logData.action,
          resource_type: logData.resource_type,
          resource_id: logData.resource_id,
          details: logData.details || '',
          created_at: logData.created_at?.toDate() || new Date(),
          ip_address: logData.ip_address || ''
        });
      });
      
      setLogs(combinedLogs);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: "Failed to load activity logs",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Fetch logs on mount
  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesResource = resourceFilter === "all" || log.resource_type === resourceFilter;
    
    return matchesSearch && matchesAction && matchesResource;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PER_PAGE));
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * LOGS_PER_PAGE, 
    currentPage * LOGS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
            <p className="text-muted-foreground">
              Track user activities across the platform.
            </p>
          </div>
          <ActivityLogActions 
            logs={filteredLogs} 
            onRefresh={fetchActivityLogs} 
            isLoading={loading} 
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>
              Track user actions, system events, and security alerts.
            </CardDescription>
            <ActivityLogFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              actionFilter={actionFilter}
              setActionFilter={setActionFilter}
              resourceFilter={resourceFilter}
              setResourceFilter={setResourceFilter}
            />
          </CardHeader>
          <CardContent>
            <ActivityLogTable
              logs={paginatedLogs}
              loading={loading}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
