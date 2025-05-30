
import React from 'react';
import StatCard from './StatCard';
import { User, ClipboardList, CheckCircle, Clock } from 'lucide-react';

interface StatsSummaryProps {
  queuedPatientsCount: number;
  completedPatientsCount: number;
  prescriptionsCount: number;
}

const StatsSummary = ({ queuedPatientsCount, completedPatientsCount, prescriptionsCount }: StatsSummaryProps) => {
  const stats = [
    {
      title: "Waiting",
      value: queuedPatientsCount,
      icon: <Clock className="h-4 w-4 text-yellow-600" />,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Completed",
      value: completedPatientsCount,
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Patients",
      value: queuedPatientsCount + completedPatientsCount,
      icon: <User className="h-4 w-4 text-blue-600" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Prescriptions",
      value: prescriptionsCount,
      icon: <ClipboardList className="h-4 w-4 text-purple-600" />,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </>
  );
};

export default StatsSummary;
