
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";

interface CSVUploadFormProps {
  onCSVUpload: (data: { salt: string; brand: string }[]) => Promise<void>;
}

const CSVUploadForm = ({ onCSVUpload }: CSVUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const parseCSV = (csvText: string): { salt: string; brand: string }[] => {
    const lines = csvText.split('\n');
    const result: { salt: string; brand: string }[] = [];
    
    // Skip header row if it exists
    const startIdx = lines[0].toLowerCase().includes('salt') && lines[0].toLowerCase().includes('brand') ? 1 : 0;
    
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',');
      if (parts.length >= 2) {
        const salt = parts[0].trim();
        const brand = parts[1].trim();
        
        if (salt && brand) {
          result.push({ salt, brand });
        }
      }
    }
    
    return result;
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive"
      });
      return;
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      
      if (data.length === 0) {
        throw new Error("No valid data found in the CSV file");
      }
      
      await onCSVUpload(data);
      
      toast({
        title: "CSV uploaded successfully",
        description: `Imported ${data.length} entries from the CSV file`,
      });
      
      setFile(null);
      // Reset the file input
      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to process the CSV file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Formulary CSV</CardTitle>
        <CardDescription>Upload a CSV file with salt and brand data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              The CSV should have two columns: Salt and Brand
            </p>
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUploadForm;
