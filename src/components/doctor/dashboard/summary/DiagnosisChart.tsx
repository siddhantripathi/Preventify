
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

interface DiagnosisChartProps {
  diagnosisData: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
        <p className="font-semibold">{payload[0].payload.name}</p>
        <p className="text-gray-600">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const DiagnosisChart = ({ diagnosisData }: DiagnosisChartProps) => {
  // Colors for the bars
  const colors = ['#4f46e5', '#7c3aed', '#1d4ed8', '#2563eb', '#3b82f6'];

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Common Diagnoses</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        {diagnosisData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={diagnosisData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              layout="vertical"
            >
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                width={120}
                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
              />
              <RechartsTooltip 
                content={<CustomTooltip />} 
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} minPointSize={2}>
                {diagnosisData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No diagnosis data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagnosisChart;
