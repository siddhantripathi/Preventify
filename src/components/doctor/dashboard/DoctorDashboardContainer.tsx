import React from "react";
import DoctorDashboardLayout from "./DoctorDashboardLayout";
import PatientTabView from "./PatientTabView";
import PatientDetailWrapper from "./PatientDetailWrapper";
import EmptyPatientPanel from "./EmptyPatientPanel";
import { useDashboardState } from "./hooks/useDashboardState";

const DoctorDashboardContainer = () => {
  const {
    currentPatient,
    aiDiagnosis,
    singleSelectedDiagnosis,
    prescriptionData,
    workupData,
    editPatientDialogOpen,
    setEditPatientDialogOpen,
    aiLoading,
    showFullscreen,
    setShowFullscreen,
    activePatientTab,
    setActivePatientTab,
    handleAIDiagnosis,
    handleDiagnosisSelect,
    handleWorkupComplete,
    handleSelectPatient,
    handleCloseCase,
    handleSendBackToQueue
  } = useDashboardState();

  return (
    <DoctorDashboardLayout>
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
        <div className={`${showFullscreen ? 'hidden lg:block' : ''} lg:w-2/5 w-full`}>
          <PatientTabView 
            activeTab={activePatientTab}
            onTabChange={setActivePatientTab}
            onSelectPatient={handleSelectPatient}
          />
        </div>
        
        <div className={`${showFullscreen ? 'w-full' : 'lg:w-3/5'} flex flex-col gap-3 sm:gap-4 lg:gap-6`}>
          {!showFullscreen && currentPatient && <EmptyPatientPanel />}
        </div>
        
        <PatientDetailWrapper
          currentPatient={currentPatient}
          showFullscreen={showFullscreen}
          setShowFullscreen={setShowFullscreen}
          aiDiagnosis={aiDiagnosis}
          singleSelectedDiagnosis={singleSelectedDiagnosis}
          prescriptionData={prescriptionData}
          workupData={workupData}
          editPatientDialogOpen={editPatientDialogOpen}
          setEditPatientDialogOpen={setEditPatientDialogOpen}
          aiLoading={aiLoading}
          onDiagnosisSelect={handleDiagnosisSelect}
          onCompleteWorkup={handleWorkupComplete}
          onCloseCase={handleCloseCase}
          onSendBackToQueue={handleSendBackToQueue}
          onAIDiagnosis={handleAIDiagnosis}
        />
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboardContainer;
