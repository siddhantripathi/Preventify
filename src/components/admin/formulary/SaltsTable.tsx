
import { Salt } from "@/types/formulary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SaltsTableProps {
  salts: Salt[];
  medications: any[]; // Using any[] since we only need to filter and get the name
}

const SaltsTable = ({ salts, medications }: SaltsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salts</CardTitle>
        <CardDescription>List of all salts in the formulary</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Salt Name</TableHead>
              <TableHead>Used In Medications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No salts found
                </TableCell>
              </TableRow>
            ) : (
              salts.map((salt) => (
                <TableRow key={salt.id}>
                  <TableCell>{salt.salt_name}</TableCell>
                  <TableCell>
                    {medications
                      .filter(med => med.salt_id === salt.id)
                      .map(med => med.generic_name)
                      .join(', ') || 'None'}
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

export default SaltsTable;
