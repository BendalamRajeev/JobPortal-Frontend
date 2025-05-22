import React from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/contexts/ApplicationContext';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { ApplicationStatus } from '@/types';
import { toast } from 'sonner';

const ApplicationReview: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { applications, loading, updateApplicationStatus } = useApplications();
  const { getJobById } = useJobs();
  const { state } = useAuth();
  
  const job = jobId ? getJobById(jobId) : undefined;
  const jobApplications = jobId ? applications.filter(app => app.jobId === jobId) : [];
  
  // Check if the current user is the employer who posted this job
  const isJobOwner = job && state.user && job.employerId === state.user.id;
  
  // If not the job owner, redirect
  if (!loading && !isJobOwner) {
    return <Navigate to="/unauthorized" />;
  }
  
  // Handle back to jobs navigation with error handling
  const handleBackToJobs = () => {
    try {
      navigate('/manage-jobs');
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to navigate back to job management. Please try again later.');
    }
  };
  
  const handleUpdateStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, status);
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-job-purple-300 border-t-job-neon-400 mx-auto"></div>
          <p className="text-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive-foreground">
          <p>Job not found.</p>
          <Button 
            variant="outline" 
            className="mt-4 border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20"
            onClick={handleBackToJobs}
          >
            Back to My Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Button 
          variant="ghost"
          onClick={handleBackToJobs}
          className="mb-2 inline-flex items-center text-job-neon-400 hover:text-job-purple-400 p-0 hover:bg-transparent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Jobs
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground">
          Applications for: {job.title}
        </h1>
        <p className="mt-2 text-foreground/70">
          {jobApplications.length} application{jobApplications.length !== 1 && 's'} received
        </p>
      </div>
      
      {jobApplications.length === 0 ? (
        <div className="rounded-lg border border-job-purple-700 bg-card p-12 text-center">
          <h3 className="mb-2 text-xl font-semibold text-job-purple-400">No applications yet</h3>
          <p className="mb-6 text-foreground">
            You haven't received any applications for this job listing yet.
          </p>
          <Button asChild className="enhanced-neon-button">
            <Link to={`/jobs/${job.id}`}>View Job Listing</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-job-purple-700 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-job-purple-700">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                    Applied On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-job-purple-700/50">
                {jobApplications.map(application => (
                  <tr key={application.id} className="hover:bg-job-purple-900/20">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-foreground">
                        {application.applicantName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-foreground/70">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.status === 'pending' && (
                        <span className="rounded-full bg-job-purple-900/50 px-3 py-1 text-xs font-medium text-job-neon-400">
                          Pending
                        </span>
                      )}
                      {application.status === 'accepted' && (
                        <span className="rounded-full bg-green-900/50 px-3 py-1 text-xs font-medium text-green-400">
                          Accepted
                        </span>
                      )}
                      {application.status === 'rejected' && (
                        <span className="rounded-full bg-red-900/50 px-3 py-1 text-xs font-medium text-red-400">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-job-neon-400 hover:text-job-purple-400 hover:underline"
                      >
                        View Resume
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                            onClick={() => handleUpdateStatus(application.id, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="job-listing-button border border-red-400 bg-white text-red-600 hover:text-red-400 hover:bg-white"
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {application.status !== 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                          onClick={() => handleUpdateStatus(application.id, 'pending')}
                        >
                          Reset to Pending
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;
