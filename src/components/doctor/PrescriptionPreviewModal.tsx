
import { useState } from "react";
import { usePatient } from "@/contexts/PatientContext";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import html2pdf from "html2pdf.js";
import { useDevice } from "@/hooks/use-mobile";
import PrescriptionContent from "./prescription/PrescriptionContent";
import PrescriptionActions from "./prescription/PrescriptionActions";
import { Prescription } from "@/types";

interface PrescriptionPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescriptionData: any;
  currentPatientId: string;
}

const PrescriptionPreviewModal = ({
  open,
  onOpenChange,
  prescriptionData,
  currentPatientId
}: PrescriptionPreviewModalProps) => {
  const { patients } = usePatient();
  const { toast } = useToast();
  const { isMobile } = useDevice();
  const [downloading, setDownloading] = useState(false);
  
  const currentPatient = patients.find(p => p.id === currentPatientId);
  
  if (!currentPatient) return null;
  
  // Determine if we're working with a full Prescription object or a draft
  const isSavedPrescription = prescriptionData && 'id' in prescriptionData;
  
  // Check if prescriptionData is undefined or empty
  const hasPrescriptionData = prescriptionData && 
    (isSavedPrescription || prescriptionData.medications || prescriptionData.diagnoses);
    
  if (!hasPrescriptionData) {
    // Return a simplified modal if there's no prescription data
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto p-4 sm:p-6 w-[calc(100%-32px)] sm:w-auto">
          <DialogHeader>
            <DialogTitle>No Prescription Available</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <p>There is no prescription data available for this patient.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Transform saved prescription format to expected format if needed
  const formattedPrescriptionData = isSavedPrescription 
    ? {
        patientId: prescriptionData.patientId || currentPatientId,
        locationId: prescriptionData.locationId,
        diagnoses: prescriptionData.diagnoses,
        medications: prescriptionData.medications,
        advice: prescriptionData.advice || [],
        followUp: prescriptionData.followUp || "",
        workupNotes: prescriptionData.workupNotes || {},
        workupParameters: prescriptionData.workupParameters || [],
        clinicalAssessment: prescriptionData.clinicalAssessment || ""
      }
    : prescriptionData;
  
  const handleDownload = async () => {
    setDownloading(true);
    const prescriptionElement = document.getElementById("prescription-preview");
    if (!prescriptionElement) {
      toast({
        title: "Error",
        description: "Cannot find prescription content",
        variant: "destructive"
      });
      setDownloading(false);
      return;
    }
    
    try {
      const fileName = `${currentPatient.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      
      const options = {
        margin: 10,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(prescriptionElement).set(options).save();
      
      toast({
        title: "Success",
        description: `Prescription downloaded as ${fileName}`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating the PDF file",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    // Simulate email sending with timeout
    setTimeout(() => {
      toast({
        title: "Email sent",
        description: `Prescription has been emailed to the patient`,
      });
    }, 1500);
  };
  
  const handlePrint = () => {
    const prescriptionElement = document.getElementById("prescription-preview");
    if (!prescriptionElement) {
      toast({
        title: "Error",
        description: "Cannot find prescription content",
        variant: "destructive"
      });
      return;
    }
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window. Please check your popup blocker.",
        variant: "destructive"
      });
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Prescription</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${prescriptionElement.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto p-4 sm:p-6 w-[calc(100%-32px)] sm:w-auto">
        <DialogHeader>
          <DialogTitle>Prescription {isSavedPrescription ? 'Record' : 'Preview'}</DialogTitle>
        </DialogHeader>
        
        <PrescriptionContent 
          patient={currentPatient} 
          prescriptionData={formattedPrescriptionData} 
        />
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
          <PrescriptionActions
            onDownload={handleDownload}
            onEmail={handleEmail}
            onPrint={handlePrint}
            downloading={downloading}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionPreviewModal;
