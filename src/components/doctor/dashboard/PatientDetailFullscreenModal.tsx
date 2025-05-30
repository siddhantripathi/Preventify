import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PatientDetailFullscreenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
}

const PatientDetailFullscreenModal = ({
  open,
  onOpenChange,
  children,
  title = "Patient Details",
}: PatientDetailFullscreenModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-full max-w-6xl h-screen min-h-[75vh] bg-white !p-0 flex flex-col justify-start overflow-y-auto" aria-describedby="patient-detail-description">
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div id="patient-detail-description" className="sr-only">Detailed patient information and consultation panel</div>
      {children}
    </DialogContent>
  </Dialog>
);

export default PatientDetailFullscreenModal;
