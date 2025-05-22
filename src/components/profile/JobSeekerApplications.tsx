import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Application, ApplicationStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useApplications } from '@/contexts/ApplicationContext';

interface JobSeekerApplicationsProps {
  applications: Application[];
}

const JobSeekerApplications: React.FC<JobSeekerApplicationsProps> = ({ applications }) => {
  const navigate = useNavigate();
  const { deleteApplication } = useApplications();

  // Group applications by status
  const groupedApplications: Record<ApplicationStatus, Application[]> = {
    pending: applications.filter(app => app.status === 'pending'),
    accepted: applications.filter(app => app.status === 'accepted'),
    rejected: applications.filter(app => app.status === 'rejected')
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
    <Card className="border-job-purple-700 bg-card">
      <CardHeader>
        <CardTitle className="text-job-purple-400">My Applications</CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center p-6">
            <p className="mb-4 text-foreground">You haven't applied for any jobs yet.</p>
            <Button asChild className="neon-button">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Application Summary */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-job-purple-700 bg-background p-4 text-center">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Pending</h3>
                <p className="text-xl font-bold text-job-neon-400">{groupedApplications.pending.length}</p>
              </div>
              <div className="rounded-lg border border-job-purple-700 bg-background p-4 text-center">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Accepted</h3>
                <p className="text-xl font-bold text-green-400">{groupedApplications.accepted.length}</p>
              </div>
              <div className="rounded-lg border border-job-purple-700 bg-background p-4 text-center">
                <h3 className="mb-2 text-sm font-semibold text-foreground">Rejected</h3>
                <p className="text-xl font-bold text-red-400">{groupedApplications.rejected.length}</p>
              </div>
            </div>
            
          <div className="space-y-4">
            {applications.map((app) => (
                <Card key={app.id} className="border-job-purple-700/50 bg-background hover:border-job-purple-500 hover:shadow-sm hover:shadow-job-purple-500/20 transition-all">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div>
                        <h3 className="font-medium text-job-purple-400">
                          <Link to={`/jobs/${app.jobId}`} className="hover:text-job-neon-400">
                            {app.jobTitle}
                          </Link>
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2 mb-2">
                          {renderStatusBadge(app.status)}
                          <span className="text-sm text-foreground/70">
                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {/* Resume Link */}
                        {app.resumeUrl && (
                          <div className="mb-2">
                            <a 
                              href={app.resumeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-job-neon-400 hover:text-job-purple-400"
                            >
                              View Resume
                            </a>
                          </div>
                        )}
                        
                        {/* Cover Letter Preview */}
                        {app.coverLetter && (
                          <div className="mb-2">
                            <p className="line-clamp-2 text-sm text-foreground/80">
                              <span className="font-medium">Cover Letter:</span> {app.coverLetter}
                    </p>
                  </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex flex-col gap-2 lg:mt-0 lg:items-end">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm" className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                            <Link to={`/jobs/${app.jobId}`}>View Job</Link>
                          </Button>
                          
                          {app.status === 'pending' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleWithdrawApplication(app.id)}
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                        
                        {app.coverLetter && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleViewCoverLetter(app)}
                            className="text-job-purple-400 hover:text-job-neon-400 hover:bg-job-purple-900/20"
                          >
                            View Full Cover Letter
                          </Button>
                        )}
                  </div>
                </div>
                  </CardContent>
              </Card>
            ))}
          </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default JobSeekerApplications;
