
import { FormularyMedication } from "@/types/formulary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MedicationsTableProps {
  medications: FormularyMedication[];
}

const MedicationsTable = ({ medications }: MedicationsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medications</CardTitle>
        <CardDescription>List of all medications in the formulary</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Salt</TableHead>
              <TableHead>Available Brands</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No medications found
                </TableCell>
              </TableRow>
            ) : (
              medications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell>{med.generic_name}</TableCell>
                  <TableCell>{med.salt?.salt_name || 'None'}</TableCell>
                  <TableCell>
                    {med.brands && med.brands.length > 0 
                      ? med.brands.map(b => b.brand_name).join(', ') 
                      : 'None'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MedicationsTable;
