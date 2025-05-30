
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentUpload = () => {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md">
      <div className="text-center py-8">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Upload Lab Results & Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop files or click to upload patient documents
        </p>
        <Button variant="outline">Select Files</Button>
      </div>

      <div className="text-sm text-muted-foreground text-center mt-2">
        Supported formats: PDF, JPG, PNG (Max size: 10MB)
      </div>
    </div>
  );
};

export default DocumentUpload;
