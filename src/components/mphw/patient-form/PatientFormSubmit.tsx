
import React from "react";
import { Button } from "@/components/ui/button";

interface PatientFormSubmitProps {
  submitting: boolean;
}

const PatientFormSubmit = ({ submitting }: PatientFormSubmitProps) => {
  return (
    <div className="pt-4">
      <Button
        type="submit"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? "Registering..." : "Register & Add to Queue"}
      </Button>
    </div>
  );
};

export default PatientFormSubmit;
