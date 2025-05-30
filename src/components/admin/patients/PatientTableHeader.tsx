
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PatientTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Age/Gender</TableHead>
        <TableHead>UHID</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Vitals</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Prescriptions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default PatientTableHeader;
