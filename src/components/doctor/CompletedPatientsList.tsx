
import { useState, useEffect } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Filter, UserCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Patient } from "@/types";
import { useDateFilter } from "@/hooks/use-date-filter";

interface CompletedPatientsListProps {
  onSelectPatient?: (patient: any) => void;
}

const CompletedPatientsList = ({ onSelectPatient }: CompletedPatientsListProps) => {
  const { patients, currentPatient, setCurrentPatient, loading } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  
  // Get only completed patients
  const completedPatients = patients.filter((p: Patient) => p.status === "completed");
  
  // Use the date filter hook
  const { 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    filteredItems: dateFilteredPatients,
    clearDateFilters
  } = useDateFilter(completedPatients, 'updatedAt');
  
  // Apply search filter
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(completedPatients);
  
  useEffect(() => {
    // Filter patients based on search term
    if (searchTerm) {
      const searchFiltered = dateFilteredPatients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(searchFiltered);
    } else {
      setFilteredPatients(dateFilteredPatients);
    }
  }, [searchTerm, dateFilteredPatients]);

  const selectPatient = (patient: any) => {
    setCurrentPatient(patient);
    if (onSelectPatient) {
      onSelectPatient(patient);
    }
  };
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100">
      <CardHeader className="pb-3 space-y-2">
        <CardTitle className="text-lg font-semibold">Completed Consultations</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-8 bg-white border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover open={dateFilterOpen} onOpenChange={setDateFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                <Filter className="h-4 w-4" />
                <span>Date Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="end">
              <div className="space-y-4">
                <h4 className="font-medium">Filter by date</h4>
                <div className="grid gap-2">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs">Start date</span>
                    <DatePicker
                      date={startDate}
                      onSelect={setStartDate}
                      placeholder="Select start date"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs">End date</span>
                    <DatePicker
                      date={endDate}
                      onSelect={setEndDate}
                      placeholder="Select end date"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearDateFilters}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setDateFilterOpen(false)}
                    className="text-xs"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-sm text-gray-500">Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No completed consultations found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPatients.map((patient) => {
              const isSelected = currentPatient?.id === patient.id;
              
              return (
                <Button
                  key={patient.id}
                  variant="ghost"
                  className={`w-full justify-start px-3 py-3 h-auto text-left rounded-md transition-colors ${
                    isSelected ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-gray-50"
                  }`}
                  onClick={() => selectPatient(patient)}
                >
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : "text-gray-900"}`}>
                          {patient.name}
                        </p>
                        
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs flex-shrink-0 bg-green-100 text-green-800">
                          completed
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="truncate">
                          {patient.age} yrs • {patient.gender.charAt(0).toUpperCase()}
                        </span>
                        {patient.visitTag && (
                          <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded-sm text-gray-600 text-xs">
                            {patient.visitTag}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-0.5">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {format(new Date(patient.updatedAt), 'dd MMM yyyy')}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedPatientsList;
