
import { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Patient } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PatientTableProps {
  patients: Patient[];
  queuedPatients: Patient[];
  onEdit: (patient: Patient) => void;
  onRevisit: (patient: Patient) => void;
  onViewPastVisit: (patient: Patient) => void;
}

const PatientTable = ({
  patients,
  queuedPatients,
  onEdit,
  onRevisit,
  onViewPastVisit,
}: PatientTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter patients based on search term (name or UHID as proxy for phone)
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.uhid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isInQueue = (patientId: string) => {
    return queuedPatients.some((p) => p.id === patientId);
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or UHID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>UHID</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{`${patient.age} / ${patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}`}</TableCell>
                  <TableCell>{patient.uhid}</TableCell>
                  <TableCell>{format(patient.updatedAt, "PPP")}</TableCell>
                  <TableCell>
                    {isInQueue(patient.id) ? (
                      <Badge className="bg-medical-accent">In Queue</Badge>
                    ) : (
                      <Badge variant="outline">Past Visit</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => onEdit(patient)}
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>

                      {!isInQueue(patient.id) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => onRevisit(patient)}
                          >
                            <RefreshCw className="h-3.5 w-3.5" /> Re-visit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => onViewPastVisit(patient)}
                          >
                            <FileText className="h-3.5 w-3.5" /> Past Visit
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No patients found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default PatientTable;
