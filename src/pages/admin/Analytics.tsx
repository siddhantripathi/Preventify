
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatient } from "@/contexts/PatientContext";

const Analytics = () => {
  const { patients, prescriptions } = usePatient();
  
  // Patient volume data
  const patientVolumeData = [
    { name: 'Monday', patients: 25 },
    { name: 'Tuesday', patients: 18 },
    { name: 'Wednesday', patients: 22 },
    { name: 'Thursday', patients: 28 },
    { name: 'Friday', patients: 30 },
    { name: 'Saturday', patients: 15 },
    { name: 'Sunday', patients: 10 },
  ];
  
  // Diagnosis data
  const diagnosisData = [
    { name: 'Upper Respiratory Infection', value: 35 },
    { name: 'Gastroenteritis', value: 20 },
    { name: 'Hypertension', value: 15 },
    { name: 'Diabetes', value: 10 },
    { name: 'Malaria', value: 8 },
    { name: 'Others', value: 12 },
  ];
  
  // AI vs Doctor match rate data
  const matchRateData = [
    { name: 'Matched', value: 75 },
    { name: 'Modified', value: 25 },
  ];
  
  // Wait time data
  const waitTimeData = [
    { name: 'Location 1', waitTime: 22 },
    { name: 'Location 2', waitTime: 18 },
    { name: 'Location 3', waitTime: 25 },
  ];
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4CAF50'];
  const MATCH_COLORS = ['#4CAF50', '#FFC107'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View system performance and usage statistics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{patients.length}</div>
              <p className="text-sm text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{prescriptions.length}</div>
              <p className="text-sm text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Avg. Wait Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">23 min</div>
              <p className="text-sm text-muted-foreground">-5% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="patient-volume">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="patient-volume">Patient Volume</TabsTrigger>
            <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
            <TabsTrigger value="ai-performance">AI Performance</TabsTrigger>
            <TabsTrigger value="wait-times">Wait Times</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient-volume">
            <Card>
              <CardHeader>
                <CardTitle>Patient Volume Trends</CardTitle>
                <CardDescription>
                  Daily/Weekly/Monthly patient visits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={patientVolumeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="patients" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        name="Patients"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diagnoses">
            <Card>
              <CardHeader>
                <CardTitle>Diagnosis Frequency</CardTitle>
                <CardDescription>
                  Most common diagnoses by condition.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diagnosisData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diagnosisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-performance">
            <Card>
              <CardHeader>
                <CardTitle>AI vs Doctor Diagnosis</CardTitle>
                <CardDescription>
                  Match rate between AI suggestions and doctor selections.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <div>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={matchRateData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {matchRateData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={MATCH_COLORS[index % MATCH_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col justify-center space-y-6">
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">AI Confidence</div>
                        <div className="text-2xl font-bold mt-1">82%</div>
                        <div className="text-xs text-muted-foreground">Average confidence score</div>
                      </div>
                      <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Top AI Diagnosis</div>
                        <div className="text-xl font-bold mt-1">URI</div>
                        <div className="text-xs text-muted-foreground">Upper Respiratory Infection</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="wait-times">
            <Card>
              <CardHeader>
                <CardTitle>Wait Time By Location</CardTitle>
                <CardDescription>
                  Average patient wait times across locations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={waitTimeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="waitTime" name="Wait Time (min)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
