
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDevice } from "@/hooks/use-mobile";

interface PrescriptionActionsProps {
  onDownload: () => Promise<void>;
  onEmail: () => Promise<void>;
  onPrint: () => void;
  downloading?: boolean;
}

const PrescriptionActions = ({ 
  onDownload, 
  onEmail, 
  onPrint,
  downloading = false 
}: PrescriptionActionsProps) => {
  const [emailing, setEmailing] = useState(false);
  const [printing, setPrinting] = useState(false);
  const { isMobile, isTablet } = useDevice();
  const { toast } = useToast();

  const handleEmail = async () => {
    try {
      setEmailing(true);
      await onEmail();
      toast({
        title: "Email sent",
        description: "Prescription has been emailed successfully."
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Email failed",
        description: "Failed to send prescription email.",
        variant: "destructive"
      });
    } finally {
      setEmailing(false);
    }
  };

  const handlePrint = () => {
    setPrinting(true);
    try {
      onPrint();
      toast({
        title: "Print initiated",
        description: "Prescription print job has been sent."
      });
    } catch (error) {
      console.error("Error printing:", error);
      toast({
        title: "Print failed",
        description: "Failed to print prescription.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setPrinting(false), 1000);
    }
  };

  const handleDownload = async () => {
    try {
      await onDownload();
      toast({
        title: "Download complete",
        description: "Prescription PDF has been downloaded."
      });
    } catch (error) {
      console.error("Error downloading:", error);
      toast({
        title: "Download failed",
        description: "Failed to download prescription PDF.",
        variant: "destructive"
      });
    }
  };

  if (isMobile || isTablet) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="flex items-center justify-center gap-2 bg-medical-primary hover:bg-medical-secondary w-full"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Downloading..." : "Download PDF"}
        </Button>
        <Button 
          variant="outline"
          onClick={handleEmail} 
          disabled={emailing}
          className="flex items-center justify-center gap-2 w-full"
        >
          <Mail className="h-4 w-4" />
          {emailing ? "Sending..." : "Email Prescription"}
        </Button>
        <Button 
          variant="outline"
          onClick={handlePrint} 
          disabled={printing}
          className="flex items-center justify-center gap-2 w-full"
        >
          <Printer className="h-4 w-4" />
          {printing ? "Printing..." : "Print Prescription"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end space-x-2">
      <Button 
        variant="outline"
        onClick={handlePrint} 
        disabled={printing}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        {printing ? "Printing..." : "Print"}
      </Button>
      <Button 
        variant="outline"
        onClick={handleEmail} 
        disabled={emailing}
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        {emailing ? "Sending..." : "Email"}
      </Button>
      <Button 
        onClick={handleDownload} 
        disabled={downloading}
        className="flex items-center gap-2 bg-medical-primary hover:bg-medical-secondary"
      >
        <Download className="h-4 w-4" />
        {downloading ? "Downloading..." : "Download PDF"}
      </Button>
    </div>
  );
};

export default PrescriptionActions;
