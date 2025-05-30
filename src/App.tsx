
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PatientProvider } from "@/contexts/PatientContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Login from "./pages/Login";
import MPHWDashboard from "./pages/MPHWDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LocationsManagement from "./pages/admin/LocationsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import PatientsManagement from "./pages/admin/PatientsManagement";
import AIMonitoring from "./pages/admin/AIMonitoring";
import PrescriptionsManagement from "./pages/admin/PrescriptionsManagement";
import QueueManagement from "./pages/admin/QueueManagement";
import Analytics from "./pages/admin/Analytics";
import ActivityLogs from "./pages/admin/ActivityLogs";
import Settings from "./pages/admin/Settings";
import FormularyManagement from "./pages/admin/FormularyManagement";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PatientProvider>
            <AdminProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Root route - Redirect to login or user's dashboard based on auth state */}
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* Protected routes */}
                  <Route path="/mphw" element={
                    <ProtectedRoute allowedRoles={['mphw', 'admin']}>
                      <MPHWDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/doctor" element={
                    <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                      <DoctorDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/locations" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <LocationsManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UsersManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/patients" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <PatientsManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/formulary" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <FormularyManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/ai-monitoring" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AIMonitoring />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/prescriptions" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <PrescriptionsManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/queue" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <QueueManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/analytics" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/logs" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ActivityLogs />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/settings" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AdminProvider>
          </PatientProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
