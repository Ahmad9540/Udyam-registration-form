// import React from 'react';

// const ProgressTracker: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
//   return (
//     <div style={{ marginBottom: '1rem' }}>
//       <p>Step {currentStep} of {totalSteps}</p>
//       <progress value={currentStep} max={totalSteps} style={{ width: '100%' }}></progress>
//     </div>
//   );
// };

// export default ProgressTracker;












import React from "react";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressTracker;
