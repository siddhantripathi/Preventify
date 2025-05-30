
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Stethoscope, ClipboardList } from "lucide-react";

interface AIDiagnosisResultProps {
  aiDiagnosis: { diagnoses: any[]; prescription: any } | null;
}

const AIDiagnosisResult = ({ aiDiagnosis }: AIDiagnosisResultProps) => {
  if (!aiDiagnosis) return null;

  // Convert advice to array if it's a string
  const getAdviceArray = (advice: string | string[]) => {
    if (!advice) return [];
    if (typeof advice === 'string') {
      return advice
        .split(/[.,;]/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    return Array.isArray(advice) ? advice : [];
  };

  const adviceArray = getAdviceArray(aiDiagnosis.prescription.advice);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Differential Diagnosis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="diagnoses" className="mt-2">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
            <TabsTrigger value="diagnoses">
              <Activity className="h-4 w-4 mr-2" /> Potential Diagnoses
            </TabsTrigger>
            <TabsTrigger value="medications">
              <ClipboardList className="h-4 w-4 mr-2" /> Suggested Medications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnoses" className="space-y-4">
            {aiDiagnosis.diagnoses.map((diagnosis, index) => (
              <div
                key={index}
                className="border rounded-md p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium flex items-center gap-2">
                    {diagnosis.name}
                    {diagnosis.icdCode && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 text-xs">
                        ICD-10: {diagnosis.icdCode}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      diagnosis.probability > 0.7
                        ? "bg-green-50 text-green-700"
                        : diagnosis.probability > 0.4
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {Math.round(diagnosis.probability * 100)}% probability
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{diagnosis.summary}</p>
                {diagnosis.workup && diagnosis.workup.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">Recommended Tests:</p>
                    <div className="flex flex-wrap gap-1">
                      {diagnosis.workup.map((test, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-gray-50">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="medications">
            <div className="space-y-4">
              {aiDiagnosis.prescription.medications?.map((med, index) => (
                <div
                  key={index}
                  className="border rounded-md p-3 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{med.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="inline-block mr-3">
                      <span className="font-medium text-gray-500">Dosage:</span> {med.dosage}
                    </span>
                    <span className="inline-block mr-3">
                      <span className="font-medium text-gray-500">Frequency:</span> {med.frequency}
                    </span>
                    <span className="inline-block">
                      <span className="font-medium text-gray-500">Duration:</span> {med.duration}
                    </span>
                  </div>
                  {med.instructions && (
                    <div className="text-xs text-gray-500 mt-1">{med.instructions}</div>
                  )}
                </div>
              ))}

              {adviceArray.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">General Advice:</h3>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {adviceArray.map((advice, index) => (
                      <li key={index}>{advice}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiDiagnosis.prescription.followUp && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">Follow up:</span>{" "}
                  {aiDiagnosis.prescription.followUp}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIDiagnosisResult;
