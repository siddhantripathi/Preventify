
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clipboard, FlaskConical, Stethoscope, ArrowRight, FileText } from "lucide-react";
import { Diagnosis } from "@/types";

interface WorkupDataEntryProps {
  selectedDiagnoses: Diagnosis[];
  prescriptionData: any;
  onComplete: (diagnoses: Diagnosis[], prescriptionData: any, workupData: any) => void;
}

type ParameterType = "lab" | "clinical" | "imaging" | "other";

interface WorkupParameter {
  id: string;
  type: ParameterType;
  name: string;
  value: string;
  diagnosisId: string;
}

const WorkupDataEntry = ({ selectedDiagnoses, prescriptionData, onComplete }: WorkupDataEntryProps) => {
  const [parameters, setParameters] = useState<WorkupParameter[]>([]);
  const [diagnosisNotes, setDiagnosisNotes] = useState<{[key: string]: string}>({});
  const [currentType, setCurrentType] = useState<ParameterType>("lab");
  const [clinicalAssessment, setClinicalAssessment] = useState<string>("");
  
  // Initialize diagnosis notes if not already present
  useEffect(() => {
    const initialNotes: {[key: string]: string} = {};
    selectedDiagnoses.forEach(diagnosis => {
      initialNotes[diagnosis.name] = diagnosis.additionalNotes || "";
    });
    setDiagnosisNotes(initialNotes);
    
    // Generate AI-based clinical assessment
    generateClinicalAssessment();
  }, [selectedDiagnoses]);

  const generateClinicalAssessment = () => {
    // Generate a simple AI assessment based on the diagnoses
    // This would be replaced with a real AI call in production
    const diagnosesList = selectedDiagnoses.map(d => d.name).join(", ");
    const probabilities = selectedDiagnoses.map(d => Math.round(d.probability * 100) + "%").join(", ");
    
    const assessment = `## Clinical Assessment

**Diagnostic Impression:** Patient presents with symptoms consistent with ${diagnosesList}.

**Differential Diagnoses:** Based on the clinical presentation, the following diagnoses are being considered with their respective probabilities: ${diagnosesList} (${probabilities}).

**Workup Plan:** Further laboratory and clinical investigations are recommended to confirm the diagnosis. Specific tests should include complete blood count, urinalysis, and targeted imaging studies as indicated.

**Initial Assessment:** Patient's condition appears stable, with vital signs within normal limits. Continued monitoring and follow-up is recommended.

*This is an AI-generated preliminary assessment. Please review and modify as needed.*
`;
    
    setClinicalAssessment(assessment);
  };

  const addParameter = (diagnosisName: string) => {
    const newParam: WorkupParameter = {
      id: `param-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: currentType,
      name: "",
      value: "",
      diagnosisId: diagnosisName
    };
    
    setParameters([...parameters, newParam]);
  };

  const updateParameter = (id: string, field: keyof WorkupParameter, value: string) => {
    setParameters(params => 
      params.map(param => 
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const removeParameter = (id: string) => {
    setParameters(params => params.filter(param => param.id !== id));
  };

  const updateDiagnosisNotes = (diagnosisName: string, notes: string) => {
    setDiagnosisNotes({
      ...diagnosisNotes,
      [diagnosisName]: notes
    });
  };

  const handleComplete = () => {
    // Update diagnoses with notes
    const updatedDiagnoses = selectedDiagnoses.map(diagnosis => ({
      ...diagnosis,
      additionalNotes: diagnosisNotes[diagnosis.name] || "",
    }));

    // Organize parameters by diagnosis for easier processing
    const workupData = {
      parameters: parameters,
      diagnosisNotes: diagnosisNotes,
      clinicalAssessment: clinicalAssessment
    };

    onComplete(updatedDiagnoses, prescriptionData, workupData);
  };

  const getParameterIcon = (type: ParameterType) => {
    switch(type) {
      case "lab": return <FlaskConical className="h-4 w-4 text-blue-500" />;
      case "clinical": return <Stethoscope className="h-4 w-4 text-green-500" />;
      case "imaging": return <Clipboard className="h-4 w-4 text-purple-500" />;
      default: return <FlaskConical className="h-4 w-4 text-gray-500" />;
    }
  };

  const parameterTypeLabels = {
    lab: "Laboratory Parameters",
    clinical: "Clinical Findings",
    imaging: "Imaging Results",
    other: "Other Observations"
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-medical-primary" />
          Workup Data Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="p-4 space-y-6">
            {/* Clinical Assessment Section */}
            <div className="border rounded-lg p-4 space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-medical-primary" />
                  <h3 className="text-sm font-medium">Clinical Assessment</h3>
                </div>
                <Badge variant="outline" className="bg-medical-primary/10 text-medical-primary">
                  AI-Assisted
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Textarea
                  value={clinicalAssessment}
                  onChange={(e) => setClinicalAssessment(e.target.value)}
                  placeholder="Clinical assessment will be generated here. You can edit it as needed."
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500 italic">
                  This AI-generated assessment is based on the selected diagnoses. 
                  Please review and modify the content before proceeding.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant={currentType === "lab" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentType("lab")}
                className={currentType === "lab" ? "bg-medical-primary" : ""}
              >
                Laboratory
              </Button>
              <Button 
                variant={currentType === "clinical" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentType("clinical")}
                className={currentType === "clinical" ? "bg-medical-primary" : ""}
              >
                Clinical
              </Button>
              <Button 
                variant={currentType === "imaging" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentType("imaging")}
                className={currentType === "imaging" ? "bg-medical-primary" : ""}
              >
                Imaging
              </Button>
              <Button 
                variant={currentType === "other" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setCurrentType("other")}
                className={currentType === "other" ? "bg-medical-primary" : ""}
              >
                Other
              </Button>
            </div>

            {selectedDiagnoses.map((diagnosis, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium">{diagnosis.name}</h3>
                    <Badge variant="outline" className="bg-medical-primary/10 text-medical-primary mt-1">
                      {Math.round(diagnosis.probability * 100)}%
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addParameter(diagnosis.name)}
                    className="text-xs"
                  >
                    + Add {currentType === "clinical" ? "Finding" : "Parameter"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Workup Plan</Label>
                  <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                    {diagnosis.workup.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  {parameters
                    .filter(param => param.diagnosisId === diagnosis.name)
                    .map((param) => (
                      <div key={param.id} className="flex items-center gap-2">
                        {getParameterIcon(param.type)}
                        <Input
                          value={param.name}
                          onChange={(e) => updateParameter(param.id, "name", e.target.value)}
                          placeholder={`${parameterTypeLabels[param.type].slice(0, -1)} name`}
                          className="text-xs flex-1"
                        />
                        <Input
                          value={param.value}
                          onChange={(e) => updateParameter(param.id, "value", e.target.value)}
                          placeholder="Value/Result"
                          className="text-xs flex-1"
                        />
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeParameter(param.id)}
                          className="h-8 w-8 p-0 text-medical-error"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Additional Notes</Label>
                  <Textarea
                    value={diagnosisNotes[diagnosis.name] || ""}
                    onChange={(e) => updateDiagnosisNotes(diagnosis.name, e.target.value)}
                    placeholder="Add clinical interpretation, assessment notes, or other relevant information"
                    className="text-xs min-h-[80px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end p-4 border-t">
        <Button 
          onClick={handleComplete}
          className="bg-medical-primary hover:bg-medical-secondary"
        >
          Proceed to Prescription <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkupDataEntry;
