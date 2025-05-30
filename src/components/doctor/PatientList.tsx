import { useState, useEffect } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, UserCircle, Clock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientListProps {
  onSelectPatient?: (patient: any) => void;
  showCompleted?: boolean;
}

const PatientList = ({ onSelectPatient, showCompleted = true }: PatientListProps) => {
  const { patients, currentPatient, setCurrentPatient, loading } = usePatient();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create a memoized version of filtered patients to prevent infinite loops
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  // Calculate displayPatients only when patients or showCompleted changes
  useEffect(() => {
    const displayPatients = showCompleted 
      ? patients 
      : patients.filter((p: any) => p.status !== "completed");
      
    // Then filter by search term
    const filtered = displayPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredPatients(filtered);
  }, [patients, searchTerm, showCompleted]);

  const selectPatient = (patient: any) => {
    setCurrentPatient(patient);
    if (onSelectPatient) {
      onSelectPatient(patient);
    }
  };
  
  return (
    <Card className="bg-white shadow-sm border border-gray-100 h-full">
      <CardHeader className="pb-2 space-y-2 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center justify-between">
          <span>Patient Queue</span>
          <span className="text-xs font-normal text-gray-500">{filteredPatients.length} patients</span>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-7 sm:pl-8 py-1 h-8 sm:h-9 text-sm bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 overflow-y-auto max-h-[calc(100vh-220px)] sm:max-h-[calc(100vh-240px)]">
        {loading ? (
          <div className="flex justify-center py-4 sm:py-8">
            <p className="text-xs sm:text-sm text-gray-500">Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-4 sm:py-8">
            <p className="text-xs sm:text-sm text-gray-500">No patients in your queue</p>
          </div>
        ) : (
          <div className="space-y-1 sm:space-y-2">
            {filteredPatients.map((patient) => {
              const isSelected = currentPatient?.id === patient.id;
              
              return (
                <Button
                  key={patient.id}
                  variant="ghost"
                  className={`w-full justify-start px-2 sm:px-3 py-2 sm:py-3 h-auto text-left rounded-md transition-colors ${
                    isSelected ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-gray-50"
                  }`}
                  onClick={() => selectPatient(patient)}
                >
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 mr-2 sm:mr-3">
                      {patient.status === "completed" ? (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full ${isSelected ? "bg-primary/20" : "bg-gray-100"} flex items-center justify-center`}>
                          <UserCircle className={`h-4 w-4 sm:h-5 sm:w-5 ${isSelected ? "text-primary" : "text-gray-500"}`} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className={`text-xs sm:text-sm font-medium truncate ${isSelected ? "text-primary" : "text-gray-900"}`}>
                          {patient.name}
                        </p>
                        
                        <span className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs flex-shrink-0 ${
                          patient.status === "waiting" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : patient.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                        <span className="truncate">
                          {patient.age} yrs • {patient.gender.charAt(0).toUpperCase()}
                        </span>
                        {patient.visitTag && (
                          <span className="ml-1 sm:ml-2 px-1 sm:px-1.5 py-0.5 bg-gray-100 rounded-sm text-gray-600 text-[9px] sm:text-xs">
                            {patient.visitTag}
                          </span>
                        )}
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

export default PatientList;
