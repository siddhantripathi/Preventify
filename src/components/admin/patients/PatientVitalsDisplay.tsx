
interface VitalsProps {
  vitals: {
    hr: number | string;
    bp: string;
    tp: number | string;
    rr?: number | string;
    spo2?: number | string;
    weight?: number | string;
    height?: number | string;
  };
}

const PatientVitalsDisplay = ({ vitals }: VitalsProps) => {
  return (
    <div className="text-xs space-y-1">
      <div>HR: {vitals.hr} bpm</div>
      <div>BP: {vitals.bp}</div>
      <div>Temp: {vitals.tp}°C</div>
      {vitals.rr && <div>RR: {vitals.rr}</div>}
      {vitals.spo2 && <div>SpO2: {vitals.spo2}%</div>}
    </div>
  );
};

export default PatientVitalsDisplay;
