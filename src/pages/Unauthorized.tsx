
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Unauthorized: React.FC = () => {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <div className="mb-6 text-job-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m2-12A10 10 0 0 0 2 12a10 10 0 0 0 11.153 9.917c.75.083 1.497-.574 1.497-1.336v-1.522c0-.664-.529-1.203-1.186-1.225A7.98 7.98 0 0 1 12 7.889a8 8 0 0 1 8 8c0 .661-.088 1.304-.255 1.915-.167.61.348 1.196.973 1.196h1.692c.662 0 1.173-.588 1.092-1.243A10.001 10.001 0 0 0 12 3z" />
          </svg>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-job-neutral-900">Access Denied</h1>
        <p className="mb-6 text-job-neutral-700">
          You don't have permission to access this page. This could be because you're not logged in or don't have the required role.
        </p>
        <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
