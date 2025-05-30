
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

interface BrandsTableProps {
  medications: FormularyMedication[];
}

const BrandsTable = ({ medications }: BrandsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brands</CardTitle>
        <CardDescription>List of all brand names in the formulary</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead>Generic Medication</TableHead>
              <TableHead>Salt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.every(med => !med.brands || med.brands.length === 0) ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No brands found
                </TableCell>
              </TableRow>
            ) : (
              medications.flatMap(med => 
                med.brands?.map(brand => (
                  <TableRow key={brand.id}>
                    <TableCell>{brand.brand_name}</TableCell>
                    <TableCell>{med.generic_name}</TableCell>
                    <TableCell>{med.salt?.salt_name || 'None'}</TableCell>
                  </TableRow>
                )) || []
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BrandsTable;
