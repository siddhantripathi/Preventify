
import React, { useMemo } from 'react';
import { usePatient } from '@/contexts/PatientContext';
import StatsSummary from './summary/StatsSummary';
import DiagnosisChart from './summary/DiagnosisChart';
import MedicationPieChart from './summary/MedicationPieChart';
import PerformanceMetrics from './summary/PerformanceMetrics';
import RecentActivity from './summary/RecentActivity';

const DoctorDashboardSummary = () => {
  const { queuedPatients, completedPatients, prescriptions } = usePatient();
  
  // Calculate common diagnoses
  const diagnosisData = useMemo(() => {
    const diagnosesCounts: Record<string, number> = {};
    
    prescriptions.forEach(prescription => {
      prescription.diagnoses.forEach(diagnosis => {
        if (diagnosesCounts[diagnosis]) {
          diagnosesCounts[diagnosis]++;
        } else {
          diagnosesCounts[diagnosis] = 1;
        }
      });
    });

    return Object.entries(diagnosesCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [prescriptions]);

  // Generate data for medications chart
  const medicationData = useMemo(() => {
    const medicationCounts: Record<string, number> = {};
    
    prescriptions.forEach(prescription => {
      prescription.medications.forEach(med => {
        if (medicationCounts[med.name]) {
          medicationCounts[med.name]++;
        } else {
          medicationCounts[med.name] = 1;
        }
      });
    });

    return Object.entries(medicationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [prescriptions]);

  // Calculate average completion time (for demonstration - since we don't have real timestamps for patient flow)
  const averageTimePerPatient = completedPatients.length > 0 ? 
    (Math.random() * 10 + 5).toFixed(1) : 
    "N/A";

  // Calculate completion rate
  const completionRate = queuedPatients.length + completedPatients.length > 0
    ? `${Math.round((completedPatients.length / (queuedPatients.length + completedPatients.length)) * 100)}%`
    : "0%";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Summary Cards */}
      <StatsSummary 
        queuedPatientsCount={queuedPatients.length}
        completedPatientsCount={completedPatients.length}
        prescriptionsCount={prescriptions.length}
      />

      {/* Common Diagnoses */}
      <DiagnosisChart diagnosisData={diagnosisData} />

      {/* Common Medications */}
      <MedicationPieChart medicationData={medicationData} />

      {/* Performance Metrics */}
      <PerformanceMetrics 
        averageTimePerPatient={averageTimePerPatient} 
        completionRate={completionRate}
      />

      {/* Recent Activity */}
      <RecentActivity completedPatients={completedPatients} />
    </div>
  );
};

export default DoctorDashboardSummary;
