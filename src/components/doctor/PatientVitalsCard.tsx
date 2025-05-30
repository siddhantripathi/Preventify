
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Weight, Ruler } from "lucide-react";
import { Patient } from "@/types";

interface PatientVitalsCardProps {
  patient: Patient;
}

const PatientVitalsCard = ({ patient }: PatientVitalsCardProps) => {
  const { vitals } = patient;
  return (
    <Card>
      <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg flex items-center gap-1 sm:gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-medical-primary" />
          Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500">Heart Rate</span>
            <span className="text-base sm:text-xl font-medium">{vitals.hr} bpm</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500">Blood Pressure</span>
            <span className="text-base sm:text-xl font-medium">{vitals.bp} mmHg</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500">Respiratory Rate</span>
            <span className="text-base sm:text-xl font-medium">{vitals.rr} /min</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500">Temperature</span>
            <span className="text-base sm:text-xl font-medium">{vitals.tp} °F</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm text-gray-500">SpO2</span>
            <span className="text-base sm:text-xl font-medium">{vitals.spo2} %</span>
          </div>
          {vitals.weight && (
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                <Weight className="h-3 w-3" /> Weight
              </span>
              <span className="text-base sm:text-xl font-medium">{vitals.weight} kg</span>
            </div>
          )}
          {vitals.height && (
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                <Ruler className="h-3 w-3" /> Height
              </span>
              <span className="text-base sm:text-xl font-medium">{vitals.height} cm</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientVitalsCard;
