
import React from "react";

const EmptyPatientPanel = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full">
      <div className="flex items-center justify-center h-40 text-gray-400">
        <span>Select a patient from the queue to view full details</span>
      </div>
    </div>
  );
};

export default EmptyPatientPanel;
