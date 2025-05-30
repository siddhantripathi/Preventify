
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Patient {
  id: string;
  name: string;
  // Add other patient fields as needed
}

interface RecentActivityProps {
  completedPatients: Patient[];
}

const RecentActivity = ({ completedPatients }: RecentActivityProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {completedPatients.length > 0 ? (
          <div className="space-y-3">
            {completedPatients.slice(0, 3).map((patient) => (
              <div key={patient.id} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-xs text-gray-500">Consultation completed</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100px] text-gray-400">
            <p>No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
