import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { toast } from 'sonner';

const EmployerJobs: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { jobs, deleteJob } = useJobs();
  const { applications } = useApplications();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  
  // Filter jobs for the current employer
  const employerJobs = jobs.filter(job => job.employerId === authState.user?.id);
  
  // Count applications per job
  const getApplicationCount = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId).length;
  };
  
  // Handle delete job
  const handleDeleteJob = async (jobId: string) => {
    // Check if there are any applications for this job
    const applicationCount = getApplicationCount(jobId);
    if (applicationCount > 0) {
      toast.error(`Cannot delete job listing. Please clear all ${applicationCount} application(s) first.`);
      return;
    }

    if (window.confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      try {
        setDeletingJobId(jobId);
        await deleteJob(jobId);
        toast.success('Job listing deleted successfully');
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Failed to delete job listing');
      } finally {
        setDeletingJobId(null);
      }
    }
  };

  // Navigation handlers with error handling
  const handleNavigate = (path: string) => () => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to navigate to the requested page. Please try again later.');
  }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold text-foreground">My Job Listings</h1>
        <Button onClick={handleNavigate('/post-job')} className="enhanced-neon-button">
          Post New Job
        </Button>
      </div>
      
      {employerJobs.length === 0 ? (
        <div className="rounded-lg border border-job-purple-700 bg-card p-12 text-center">
          <h3 className="mb-2 text-xl font-semibold text-job-purple-400">No job listings found</h3>
          <p className="mb-6 text-foreground/80">
            You haven't posted any jobs yet. Start by creating your first job listing!
          </p>
          <Button onClick={handleNavigate('/post-job')} className="enhanced-neon-button">
            Post a Job
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {employerJobs.map(job => (
            <div key={job.id} className="job-listing-item">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h2 className="mb-1 text-xl font-semibold text-job-purple-400">
                    <button 
                      onClick={handleNavigate(`/jobs/${job.id}`)}
                      className="text-job-purple-400 hover:text-job-neon-400 cursor-pointer text-left"
                    >
                      {job.title}
                    </button>
                  </h2>
                  <p className="mb-2 text-foreground/80">
                    {job.location} • Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="mb-3 flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="badge-blue">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="badge-gray">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="badge-blue">
                      {getApplicationCount(job.id)} Applications
                    </span>
                    {job.salary && (
                      <span className="text-sm text-foreground/70">{job.salary}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleNavigate(`/jobs/${job.id}`)}
                    className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleNavigate(`/applications/${job.id}`)}
                    className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                  >
                    Applications
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleNavigate(`/edit-job/${job.id}`)}
                    className="job-listing-button border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDeleteJob(job.id)}
                    disabled={deletingJobId === job.id}
                    className="job-listing-button border border-red-400 bg-white text-red-600 hover:text-red-400 hover:bg-white"
                  >
                    {deletingJobId === job.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;
