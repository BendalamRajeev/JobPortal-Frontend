import React from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthContext';

const CoverLetterView: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useAuth();
  const { applications } = useApplications();
  
  // Get cover letter from state if available, otherwise from applications
  const coverLetterFromState = location.state?.coverLetter;
  const jobTitleFromState = location.state?.jobTitle;
  
  const application = applications.find(app => app.id === applicationId);
  
  // Use state data if available, otherwise use application data
  const coverLetter = coverLetterFromState || application?.coverLetter;
  const jobTitle = jobTitleFromState || application?.jobTitle;
  
  // Ensure the user is authorized to view this cover letter
  const isAuthorized = state.isAuthenticated && (
    state.user?.role === 'admin' || 
    (application && application.userId === state.user?.id)
  );
  
  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (!isAuthorized || !coverLetter) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center text-destructive-foreground">
          <h2 className="mb-4 text-2xl font-bold">Access Denied</h2>
          <p className="mb-6">You don't have permission to view this cover letter or it doesn't exist.</p>
          <Button onClick={handleGoBack} className="neon-button">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Button 
        onClick={handleGoBack}
        className="mb-6 inline-flex items-center text-job-neon-400 hover:text-job-purple-400"
        variant="ghost"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Button>
      
      <div className="rounded-lg border border-job-purple-700 bg-card p-6 shadow-md">
        <div className="mb-6 border-b border-job-purple-700 pb-4">
          <h1 className="text-2xl font-bold text-job-purple-400">Cover Letter</h1>
          {jobTitle && (
            <p className="mt-2 text-foreground/80">
              For position: <span className="text-job-neon-400">{jobTitle}</span>
            </p>
          )}
        </div>
        
        <div className="prose max-w-none text-foreground">
          <p className="whitespace-pre-line">{coverLetter}</p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterView; 