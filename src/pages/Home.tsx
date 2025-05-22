import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/contexts/JobContext';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { jobs } = useJobs();
  const { isAuthenticated, user } = state;

  // Get recent jobs (6 most recent)
  const recentJobs = [...jobs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  // Navigation handlers with error handling
  const handleNavigate = (path: string) => () => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to navigate to the requested page. Please try again later.');
    }
  };

  const handleJobDetailNavigate = (jobId: string) => () => {
    try {
      navigate(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to load job details. Please try again later.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-purple-gradient py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-job-purple-400 via-50% to-blue-400 to-80% md:text-5xl lg:text-6xl">
  Find Your Dream Job Today
</h1>

            <p className="mb-8 text-xl">
              Connect with top employers and discover opportunities that match your skills and career goals.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              {!isAuthenticated ? (
                <>
                  <Button size="lg" onClick={handleNavigate('/register')} className="enhanced-neon-button">
                    Create Account
                  </Button>
                  <Button 
  size="lg" 
  variant="outline" 
  onClick={handleNavigate('/jobs')} 
  className="
    bg-white text-job-neon-600 border border-job-neon-400 rounded-md px-5 py-2.5 font-semibold
    transition-all duration-300 ease-in-out relative overflow-hidden
    hover:bg-job-neon-900 hover:text-job-neon-400 hover:border-job-neon-400
    hover:shadow-[0_0_10px_rgba(163,112,255,0.7)] hover:-translate-y-0.5
    active:translate-y-0.5 active:shadow-sm active:shadow-job-neon-400/30
    focus:outline-none focus:ring-2 focus:ring-job-neon-400/50 focus:ring-offset-1 focus:ring-offset-background
  "
>
  Browse Jobs
</Button>

                </>
              ) : (
                <>
                  {user?.role === 'jobseeker' && (
                    <Button size="lg" onClick={handleNavigate('/jobs')} className="
                    bg-white text-job-neon-600 border border-job-neon-400 rounded-md px-5 py-2.5 font-semibold
                    transition-all duration-300 ease-in-out relative overflow-hidden
                    hover:bg-job-neon-900 hover:text-job-neon-400 hover:border-job-neon-400
                    hover:shadow-[0_0_10px_rgba(163,112,255,0.7)] hover:-translate-y-0.5
                    active:translate-y-0.5 active:shadow-sm active:shadow-job-neon-400/30
                    focus:outline-none focus:ring-2 focus:ring-job-neon-400/50 focus:ring-offset-1 focus:ring-offset-background
                  ">
                      Find Jobs
                    </Button>
                  )}
                  {user?.role === 'employer' && (
                    <Button size="lg" onClick={handleNavigate('/post-job')} 
                    className="
    bg-white text-job-neon-600 border border-job-neon-400 rounded-md px-5 py-2.5 font-semibold
    transition-all duration-300 ease-in-out relative overflow-hidden
    hover:bg-job-neon-900 hover:text-job-neon-400 hover:border-job-neon-400
    hover:shadow-[0_0_10px_rgba(163,112,255,0.7)] hover:-translate-y-0.5
    active:translate-y-0.5 active:shadow-sm active:shadow-job-neon-400/30
    focus:outline-none focus:ring-2 focus:ring-job-neon-400/50 focus:ring-offset-1 focus:ring-offset-background
  ">
                      Post a Job
                    </Button>
                  )}
                  {user?.role === 'admin' && (
                    <Button size="lg" onClick={handleNavigate('/admin/jobs')} className="enhanced-neon-button">
                      Manage Jobs
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-job-purple-700 p-6 text-center shadow-md bg-card hover:shadow-job-purple-500/30 hover:shadow-md transition-all">
              <div className="mb-4 text-4xl font-bold text-job-neon-400">{jobs.length}</div>
              <p className="text-foreground">Active Job Listings</p>
            </div>
            <div className="rounded-lg border border-job-purple-700 p-6 text-center shadow-md bg-card hover:shadow-job-purple-500/30 hover:shadow-md transition-all">
              <div className="mb-4 text-4xl font-bold text-job-neon-400">5</div>
              <p className="text-foreground">Registered Companies</p>
            </div>
            <div className="rounded-lg border border-job-purple-700 p-6 text-center shadow-md bg-card hover:shadow-job-purple-500/30 hover:shadow-md transition-all">
              <div className="mb-4 text-4xl font-bold text-job-neon-400">100%</div>
              <p className="text-foreground">Successful Placements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold neon-text">Recent Job Openings</h2>
            <p className="text-foreground">Explore the latest opportunities from top companies</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentJobs.map(job => (
              <div key={job.id} className="job-card">
                <h3 className="mb-2 text-xl font-semibold text-job-purple-400">
                  <button 
                    onClick={handleJobDetailNavigate(job.id)} 
                    className="text-left hover:text-job-neon-400 cursor-pointer"
                  >
                    {job.title}
                  </button>
                </h3>
                <p className="mb-3 text-sm text-foreground">
                  {job.companyName} • {job.location}
                </p>
                <p className="mb-4 line-clamp-2 text-foreground">
                  {job.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <Button 
                    size="sm" 
                    onClick={handleJobDetailNavigate(job.id)} 
                    className="enhanced-neon-button"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="enhanced-neon-button">
              <Link to="/jobs">View All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold neon-text">Why Choose JobPortal</h2>
            <p className="text-foreground">The leading platform for finding your next career opportunity</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg p-6 bg-card neon-border">
              <div className="mb-4 h-12 w-12 rounded-full bg-job-purple-900 text-job-neon-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-job-purple-400">Smart Job Matching</h3>
              <p className="text-foreground">
                Our intelligent algorithm matches your skills and experience with the right job opportunities.
              </p>
            </div>
            <div className="rounded-lg p-6 bg-card neon-border">
              <div className="mb-4 h-12 w-12 rounded-full bg-job-purple-900 text-job-neon-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-job-purple-400">Verified Employers</h3>
              <p className="text-foreground">
                All companies on our platform are thoroughly vetted to ensure legitimate job opportunities.
              </p>
            </div>
            <div className="rounded-lg p-6 bg-card neon-border">
              <div className="mb-4 h-12 w-12 rounded-full bg-job-purple-900 text-job-neon-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-job-purple-400">Fast Application Process</h3>
              <p className="text-foreground">
                Apply to multiple jobs with just a few clicks, and track your application status in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="neon-gradient-bg py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to take the next step in your career?</h2>
            <p className="mb-8 text-xl">
              Join thousands of professionals who have found their dream jobs on JobPortal.
            </p>
            <Button size="lg" asChild className="bg-white text-job-purple-700 hover:bg-job-neutral-100 hover:shadow-md hover:shadow-job-purple-500/30 hover:translate-y-[-1px]">
              <Link to={isAuthenticated ? "/jobs" : "/register"}>
                {isAuthenticated ? "Browse Jobs" : "Get Started"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
