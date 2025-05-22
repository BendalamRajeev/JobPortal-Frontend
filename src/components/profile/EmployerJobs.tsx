import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EmployerJobsProps {
  isAdmin?: boolean;
}

const EmployerJobs: React.FC<EmployerJobsProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { jobs, loading, reloadJobs } = useJobs();
  
  // Filter jobs based on user role
  const filteredJobs = isAdmin 
    ? jobs // Admin sees all jobs
    : jobs.filter(job => job.employerId === state.user?.id);

  // Navigation with error handling
  const handleNavigate = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to navigate to the requested page. Please try again later.');
    }
  };
  
  const handleManageJobs = () => {
    handleNavigate('/manage-jobs');
  };
  
  const handlePostJob = () => {
    handleNavigate('/post-job');
  };

  const handleRefresh = async () => {
    try {
      await reloadJobs();
      toast.success('Job listings refreshed');
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error('Failed to refresh job listings');
    }
  };

  return (
    <Card className="border-job-purple-700 bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-job-purple-400">{isAdmin ? 'All Jobs' : 'My Job Postings'}</CardTitle>
        <div className="space-x-2">
          <Button onClick={handleRefresh} variant="outline" className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
            Refresh
          </Button>
          {!isAdmin && (
            <Button onClick={handlePostJob} className="enhanced-neon-button">
              Post New Job
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-job-purple-300 border-t-job-neon-400"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <Card key={job.id} className="job-listing-item">
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-job-purple-400">{job.title}</h3>
                      <p className="text-sm text-foreground/70">{job.companyName || 'Unknown Company'} • {job.location}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="inline-block rounded-full bg-job-neon-900/50 px-2 py-1 text-xs font-medium text-job-neon-400">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="inline-block rounded-full bg-job-neutral-800/50 px-2 py-1 text-xs font-medium text-job-neutral-300">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2 lg:mt-0">
                      <Button 
                        variant="outline" 
                        onClick={() => handleNavigate(`/jobs/${job.id}`)} 
                        className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                      >
                        View
                      </Button>
                      {(!isAdmin || state.user?.role === 'admin') && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleNavigate(`/applications/${job.id}`)} 
                          className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                        >
                          Applications
                        </Button>
                      )}
                      {(!isAdmin || state.user?.role === 'admin') && (
                        <Button 
                          variant="outline" 
                          onClick={() => handleNavigate(`/edit-job/${job.id}`)} 
                          className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="mb-4 text-foreground">
              {isAdmin ? 'No jobs found in the system.' : 'You haven\'t posted any jobs yet.'}
            </p>
            {!isAdmin && (
              <Button onClick={handlePostJob} className="enhanced-neon-button">
                Post Your First Job
              </Button>
            )}
          </div>
        )}
        
        {!isAdmin && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={handleManageJobs} className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
              Go to Jobs Management
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployerJobs;
