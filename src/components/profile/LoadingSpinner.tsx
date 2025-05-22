import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-job-purple-300 border-t-job-neon-400"></div>
    </div>
  );
};

export default LoadingSpinner;
