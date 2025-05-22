import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { toast } from 'sonner';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById } = useJobs();
  const { state: authState } = useAuth();
  const { applications, createApplication } = useApplications();
  
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const job = id ? getJobById(id) : undefined;
  
  // Check if user has already applied to this job
  const hasApplied = authState.user && applications.some(
    app => app.jobId === id && app.userId === authState.user?.id
  );

  // Check if the current user is the job owner
  const isJobOwner = authState.user && job && job.employerId === authState.user.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if the file is a PDF
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setResumeFile(file);
    }
  };

  // Handle navigation to jobs page with error handling
  const handleViewSimilarJobs = () => {
    try {
      navigate('/jobs');
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to load jobs page. Please try again later.');
    }
  };

  // Handle back to jobs navigation with error handling
  const handleBackToJobs = () => {
    try {
      navigate('/jobs');
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to navigate back to jobs. Please try again later.');
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.isAuthenticated) {
      toast.error('Please login to apply for this job');
      navigate('/login');
      return;
    }
    
    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }
    
    if (!job || !authState.user) return;
    
    try {
      setSubmitting(true);
      // Upload the resume file to FastAPI backend
      const formData = new FormData();
      formData.append('file', resumeFile);
      const uploadResponse = await fetch('http://localhost:8000/upload-resume/', {
        method: 'POST',
        body: formData,
      });
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }
      const uploadData = await uploadResponse.json();
      const resumeUrl = `http://localhost:8000${uploadData.resume_url}`;
      
      await createApplication({
        jobId: job.id,
        userId: authState.user.id,
        resumeUrl: resumeUrl,
        coverLetter,
        applicantName: authState.user.name || authState.user.email,
        jobTitle: job.title
      });
      
      setIsApplying(false);
      setCoverLetter('');
      setResumeFile(null);
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to apply for job');
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-destructive-foreground">
          <p>Job not found.</p>
          <Button 
            variant="outline" 
            className="mt-4 border-destructive text-destructive hover:bg-destructive/20"
            onClick={handleBackToJobs}
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button 
        variant="ghost"
        onClick={handleBackToJobs}
        className="mb-6 inline-flex items-center text-job-neon-400 hover:text-job-purple-400 p-0 hover:bg-transparent"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Jobs
      </Button>
      
      <div className="rounded-lg border border-job-purple-700 bg-card p-6 shadow-sm">
        <div className="mb-6 border-b border-job-purple-700 pb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{job.title}</h1>
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-foreground/80">
            <span>{job.companyName}</span>
            <span>•</span>
            <span>{job.location}</span>
            {job.jobType && (
              <>
                <span>•</span>
                <span>{job.jobType}</span>
              </>
            )}
            {job.salary && (
              <>
                <span>•</span>
                <span className="text-job-neon-400">{job.salary}</span>
              </>
            )}
          </div>
          
          <div className="mb-4">
            <span className="text-sm text-foreground/70">
              Posted on {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span key={skill} className="badge-blue">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-job-purple-400">Job Description</h2>
          <div className="prose max-w-none text-foreground">
            <p className="whitespace-pre-line">{job.description}</p>
          </div>
        </div>
        
        <div className="border-t border-job-purple-700 pt-6">
          {!isApplying ? (
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20"
                onClick={handleViewSimilarJobs}
              >
                View Similar Jobs
              </Button>
              
              {authState.isAuthenticated && authState.user?.role === 'jobseeker' && (
                <>
                  {hasApplied ? (
                    <Button disabled className="bg-job-neutral-500">
                      Applied
                    </Button>
                  ) : (
                    <Button onClick={() => setIsApplying(true)} className="enhanced-neon-button">
                      Apply Now
                    </Button>
                  )}
                </>
              )}
              
              {isJobOwner && (
                <Button asChild className="enhanced-neon-button">
                  <Link to={`/applications/${job.id}`}>View Applications</Link>
                </Button>
              )}
              
              {!authState.isAuthenticated && (
                <Button asChild className="enhanced-neon-button">
                  <Link to="/login">Login to Apply</Link>
                </Button>
              )}
              
              {authState.isAuthenticated && authState.user?.role !== 'jobseeker' && !isJobOwner && (
                <Button disabled className="bg-job-neutral-500">
                  Employer Account
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-job-purple-700 bg-background/30 p-6">
              <h3 className="mb-4 text-lg font-semibold text-job-purple-400">
                Apply for: {job.title}
              </h3>
              
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Resume (PDF)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="block w-full cursor-pointer rounded-lg border border-job-purple-700 bg-background text-sm text-foreground file:mr-4 file:border-0 file:bg-job-purple-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-job-purple-600"
                    required
                  />
                  <p className="mt-1 text-xs text-foreground/70">
                    Upload your resume in PDF format
                  </p>
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Cover Letter (Optional)
                  </label>
                  <Textarea
                    placeholder="Tell us why you're a good fit for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="min-h-[150px] bg-background text-foreground border-job-purple-700 focus:border-job-neon-400"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsApplying(false)}
                    disabled={submitting}
                    className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={submitting || !resumeFile}
                    className="neon-button"
                  >
                    {submitting ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Submitting...
                      </>
                    ) : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
