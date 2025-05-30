
import React from "react";
import Layout from "@/components/layout/Layout";

interface DoctorDashboardLayoutProps {
  children: React.ReactNode;
}

const DoctorDashboardLayout = ({ children }: DoctorDashboardLayoutProps) => {
  return (
    <Layout requiredRole="doctor">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
        <p className="text-gray-500">Manage patient consultations and prescriptions</p>
      </div>
      {children}
    </Layout>
  );
};

export default DoctorDashboardLayout;
