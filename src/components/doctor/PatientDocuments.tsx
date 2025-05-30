
import { useState } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  FileImage, 
  FilePlus, 
  Download, 
  Trash2, 
  File 
} from "lucide-react";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientDocument } from "@/types";
import { supabase } from "@/integrations/supabase/client";

const PatientDocuments = () => {
  const { 
    currentPatient, 
    getPatientDocuments, 
    addDocumentToPatient,
    deletePatientDocument 
  } = usePatient();
  const [viewDocument, setViewDocument] = useState<PatientDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!currentPatient) {
    return null;
  }

  const documents = getPatientDocuments(currentPatient.id);

  const getDocumentIcon = (docType: string, fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileImage className="h-4 w-4 text-blue-500" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length || !currentPatient) return;
    
    setIsUploading(true);
    const file = event.target.files[0];
    
    try {
      // Upload file to Supabase Storage
      const filePath = `${currentPatient.id}/${Date.now()}_${file.name}`;
      
      // Read file as base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        // Create document object
        const documentData = {
          patientId: currentPatient.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: reader.result as string,
          documentType: determineDocumentType(file.type),
          notes: `Uploaded on ${format(new Date(), "PPpp")}`,
        };
        
        await addDocumentToPatient(currentPatient.id, documentData);
        setIsUploading(false);
        // Reset file input
        event.target.value = '';
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading document:", error);
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const determineDocumentType = (fileType: string): "lab-result" | "prescription" | "report" | "image" | "other" => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType === "application/pdf") return "report";
    return "other";
  };

  const handleDeleteDocument = (document: PatientDocument) => {
    if (confirm(`Are you sure you want to delete "${document.fileName}"?`)) {
      deletePatientDocument(document.id);
    }
  };

  const handleViewDocument = (document: PatientDocument) => {
    setViewDocument(document);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-medical-primary" />
            Patient Documents
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('document-upload')?.click()}
              disabled={isUploading}
              className="flex items-center gap-1"
            >
              <FilePlus className="h-4 w-4" />
              Upload Document
            </Button>
            <input
              id="document-upload"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No documents available for this patient</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDocumentIcon(document.documentType, document.fileType)}
                        <Badge variant="outline">
                          {document.documentType.charAt(0).toUpperCase() + document.documentType.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{document.fileName}</TableCell>
                    <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                    <TableCell>{format(document.uploadedAt, "PPp")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDocument(document)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDeleteDocument(document)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
        
        {/* Document Viewer Dialog */}
        <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{viewDocument?.fileName}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-2 min-h-[300px]">
              {viewDocument?.fileType.startsWith("image/") ? (
                <img 
                  src={viewDocument.fileUrl} 
                  alt={viewDocument.fileName} 
                  className="max-w-full h-auto mx-auto"
                />
              ) : viewDocument?.fileType === "application/pdf" ? (
                <iframe 
                  src={viewDocument.fileUrl} 
                  className="w-full h-full min-h-[500px]" 
                  title={viewDocument.fileName}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <FileText className="h-16 w-16 text-gray-400" />
                  <p className="mt-2 text-gray-600">This file type cannot be previewed</p>
                  <Button className="mt-4" asChild>
                    <a href={viewDocument?.fileUrl} download={viewDocument?.fileName} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" /> Download File
                    </a>
                  </Button>
                </div>
              )}
            </div>
            <div className="p-2 border-t">
              <p className="text-sm text-gray-500">{viewDocument?.notes}</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PatientDocuments;
