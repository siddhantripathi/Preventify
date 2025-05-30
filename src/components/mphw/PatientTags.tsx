
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

type PatientTagsProps = {
  patientId: string;
  onTagSelect?: (tag: VisitTag) => void;
  defaultTag?: VisitTag;
};

export type VisitTag = "consultation" | "review" | "lab-result" | "follow-up" | "emergency";

const PatientTags = ({ patientId, onTagSelect, defaultTag = "consultation" }: PatientTagsProps) => {
  const [selectedTag, setSelectedTag] = useState<VisitTag>(defaultTag);

  const handleTagSelect = (tag: VisitTag) => {
    setSelectedTag(tag);
    if (onTagSelect) {
      onTagSelect(tag);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={selectedTag === "consultation" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => handleTagSelect("consultation")}
      >
        <Tag className="h-3.5 w-3.5" />
        Consultation
      </Button>
      
      <Button
        type="button"
        variant={selectedTag === "review" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => handleTagSelect("review")}
      >
        <Tag className="h-3.5 w-3.5" />
        Review
      </Button>
      
      <Button
        type="button"
        variant={selectedTag === "lab-result" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => handleTagSelect("lab-result")}
      >
        <Tag className="h-3.5 w-3.5" />
        Lab Result
      </Button>
      
      <Button
        type="button"
        variant={selectedTag === "follow-up" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => handleTagSelect("follow-up")}
      >
        <Tag className="h-3.5 w-3.5" />
        Follow-up
      </Button>
      
      <Button
        type="button"
        variant={selectedTag === "emergency" ? "default" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => handleTagSelect("emergency")}
      >
        <Tag className="h-3.5 w-3.5" />
        Emergency
      </Button>
    </div>
  );
};

export default PatientTags;
