
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceMetricsProps {
  averageTimePerPatient: string;
  completionRate: string;
}

const PerformanceMetrics = ({ averageTimePerPatient, completionRate }: PerformanceMetricsProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-500">Avg Time Per Patient</p>
            <p className="text-xl font-semibold">{averageTimePerPatient} min</p>
          </div>
          <div className="space-y-2 p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-500">Completion Rate</p>
            <p className="text-xl font-semibold">{completionRate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
