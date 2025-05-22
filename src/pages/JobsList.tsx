import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJobs } from '@/contexts/JobContext';
import { toast } from 'sonner';

const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const { filteredJobs, loading, error, filters, setFilters, reloadJobs, usingFallbackData } = useJobs();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [locationTerm, setLocationTerm] = useState(filters.location || '');
  const [retrying, setRetrying] = useState(false);
  
  // Get unique locations for the filter dropdown
  const uniqueLocations = [...new Set(filteredJobs.map(job => job.location))];

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      location: locationTerm
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationTerm('');
    setFilters({});
  };

  // Handle retry when there's an error
  const handleRetry = async () => {
    setRetrying(true);
    try {
      await reloadJobs();
    } catch (err) {
      console.error('Error retrying job fetch:', err);
    } finally {
      setRetrying(false);
    }
  };

  // Handle navigation to job detail with error handling
  const handleJobDetailNavigate = (jobId: string) => () => {
    try {
      navigate(`/jobs/${jobId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to load job details. Please try again later.');
    }
  };

  if (loading || retrying) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-job-purple-300 border-t-job-neon-400 mx-auto"></div>
          <p className="text-foreground">{retrying ? 'Retrying connection...' : 'Loading jobs...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center text-destructive-foreground">
          <p className="mb-4 text-lg font-semibold">Error loading jobs</p>
          <p className="mb-6">{error}</p>
          <p className="mb-6 text-sm">This could be due to a database connection issue or server problem. Please try again later.</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleRetry} className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
              {retrying ? 'Retrying...' : 'Retry Connection'}
            </Button>
            <Button onClick={() => window.location.reload()} className="enhanced-neon-button">
              Refresh Page
          </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold neon-text">Available Job Opportunities</h1>
      
      {usingFallbackData && (
        <div className="mb-8 rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-amber-400">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Database Connection Issue</span>
          </div>
          <p className="mt-2 text-sm">
            Currently showing demo data due to a database connection issue. Some features may be limited.
            <Button 
              variant="link" 
              onClick={handleRetry} 
              className="ml-2 p-0 text-amber-400 hover:text-amber-300 underline"
            >
              Retry Connection
            </Button>
          </p>
        </div>
      )}
      
      {/* Search and Filter Section */}
      <div className="mb-8 rounded-lg border border-job-purple-700 bg-card p-6 shadow-md">
        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-3">
          <div>
            <Input
              type="text"
              placeholder="Job title, skills, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background text-foreground border-job-purple-700 focus:border-job-neon-400"
            />
          </div>
          
          <div>
            <select
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="h-10 w-full rounded-md border border-job-purple-700 bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-job-neon-400 focus:ring-offset-2"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 enhanced-neon-button">
              Search Jobs
            </Button>
            <Button type="button" variant="outline" onClick={handleResetFilters} className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
              Reset
            </Button>
          </div>
        </form>
      </div>
      
      {/* Results Count */}
      <div className="mb-4 text-foreground">
        {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
      </div>
      
      {/* Job Listing */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="job-listing-item"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-4 lg:mb-0">
                  <h2 className="mb-1 text-xl font-semibold text-job-purple-400 hover:text-job-neon-400">
                    <button 
                      onClick={handleJobDetailNavigate(job.id)} 
                      className="text-left text-xl font-semibold text-job-purple-400 hover:text-job-neon-400 cursor-pointer"
                    >
                      {job.title}
                    </button>
                  </h2>
                  <p className="mb-2 text-foreground">{job.companyName} • {job.location}</p>
                  
                  <div className="mb-3 flex flex-wrap gap-2">
                    {job.skills.slice(0, 5).map((skill) => (
                      <span key={skill} className="badge-blue">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="badge-gray">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  <p className="line-clamp-2 text-sm text-foreground">
                    {job.description}
                  </p>
                </div>
                
                <div className="flex flex-col items-start gap-3 lg:items-end">
                  {job.salary && (
                    <span className="text-sm font-medium text-job-neon-400">{job.salary}</span>
                  )}
                  
                  <span className="text-sm text-foreground">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  
                  <Button 
                    onClick={handleJobDetailNavigate(job.id)} 
                    className="enhanced-neon-button"
                  >
                    View Job
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-job-purple-700 bg-card p-12 text-center">
          <h3 className="mb-2 text-xl font-semibold text-job-purple-400">No jobs found</h3>
          <p className="mb-6 text-foreground">Try adjusting your search criteria</p>
          <Button onClick={handleResetFilters} className="enhanced-neon-button">Reset Filters</Button>
        </div>
      )}
    </div>
  );
};

export default JobsList;
