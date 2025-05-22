import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Application, ApplicationStatus } from '@/types';

const JobSeekerApplications: React.FC = () => {
  const { state } = useAuth();
  const { applications, loading, deleteApplication } = useApplications();
  const navigate = useNavigate();
  
  const userApplications = state.user
    ? applications.filter(app => app.userId === state.user?.id)
    : [];

  // Group applications by status
  const groupedApplications: Record<ApplicationStatus, Application[]> = {
    pending: userApplications.filter(app => app.status === 'pending'),
    accepted: userApplications.filter(app => app.status === 'accepted'),
    rejected: userApplications.filter(app => app.status === 'rejected')
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await deleteApplication(applicationId);
      } catch (error) {
        console.error('Error withdrawing application:', error);
      }
    }
  };

  const handleViewCoverLetter = (application: Application) => {
    navigate(`/cover-letter/${application.id}`, {
      state: {
        coverLetter: application.coverLetter,
        jobTitle: application.jobTitle
      }
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-job-purple-300 border-t-job-neon-400 mx-auto"></div>
          <p className="text-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  // Helper function to render status badge
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return <span className="rounded-full bg-job-purple-900/50 px-3 py-1 text-xs font-medium text-job-neon-400">Pending</span>;
      case 'accepted':
        return <span className="rounded-full bg-green-900/50 px-3 py-1 text-xs font-medium text-green-400">Accepted</span>;
      case 'rejected':
        return <span className="rounded-full bg-red-900/50 px-3 py-1 text-xs font-medium text-red-400">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold neon-text">My Job Applications</h1>
      
      {userApplications.length === 0 ? (
        <div className="rounded-lg border border-job-purple-700 bg-card p-12 text-center">
          <h3 className="mb-2 text-xl font-semibold text-foreground">No applications found</h3>
          <p className="mb-6 text-foreground/80">
            You haven't applied to any jobs yet. Start exploring opportunities!
          </p>
          <Button asChild className="neon-button">
            <Link to="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Application Summary */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-job-purple-700 bg-card p-6 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Pending</h3>
              <p className="text-2xl font-bold text-job-neon-400">{groupedApplications.pending.length}</p>
            </div>
            <div className="rounded-lg border border-job-purple-700 bg-card p-6 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Accepted</h3>
              <p className="text-2xl font-bold text-green-400">{groupedApplications.accepted.length}</p>
            </div>
            <div className="rounded-lg border border-job-purple-700 bg-card p-6 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">Rejected</h3>
              <p className="text-2xl font-bold text-red-400">{groupedApplications.rejected.length}</p>
            </div>
          </div>
          
          {/* Application History Title */}
          <h2 className="mb-6 text-2xl font-semibold text-foreground">Application History</h2>
          
          {/* Application Cards */}
          <div className="grid grid-cols-1 gap-6">
              {userApplications.map(application => (
              <div 
                key={application.id} 
                className="job-card hover:border-job-purple-500 hover:shadow-lg hover:shadow-job-purple-500/20"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="mb-1 text-xl font-semibold text-job-purple-400">
                      <Link to={`/jobs/${application.jobId}`} className="hover:text-job-neon-400">
                          {application.jobTitle}
                        </Link>
                      </h3>
                    
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        {renderStatusBadge(application.status)}
                      <span className="text-sm text-foreground/70">
                          Applied on {new Date(application.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    
                    {/* Resume Link */}
                    <div className="mb-2">
                      <a 
                        href={application.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-job-neon-400 hover:text-job-purple-400"
                      >
                        View Uploaded Resume
                      </a>
                    </div>
                    
                    {/* Cover Letter Preview (if available) */}
                    {application.coverLetter && (
                      <div className="mb-2">
                        <p className="line-clamp-2 text-sm text-foreground/80">
                          <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm" className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                        <Link to={`/jobs/${application.jobId}`}>View Job</Link>
                      </Button>
                      
                      {application.status === 'pending' && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleWithdrawApplication(application.id)}
                        >
                          Withdraw
                        </Button>
                      )}
                  </div>
                  
                    {application.coverLetter && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleViewCoverLetter(application)}
                        className="text-job-purple-400 hover:text-job-neon-400 hover:bg-job-purple-900/20"
                    >
                        View Full Cover Letter
                      </Button>
                    )}
                  </div>
                    </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default JobSeekerApplications;
