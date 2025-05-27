import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Job, JobFilters, PaginatedResponse } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const API_BASE_URL = 'https://job-portal-backend-8goo.onrender.com';

// Define the Job Context type
interface JobContextType {
  jobs: Job[];
  filteredJobs: Job[];
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  setFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
  getJobById: (id: string) => Job | undefined;
  getJobsByEmployer: (employerId: string) => Job[];
  createJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<Job>;
  updateJob: (id: string, job: Partial<Job>) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  reloadJobs: () => Promise<void>;
  usingFallbackData: boolean;
}

// Create the context
const JobContext = createContext<JobContextType | undefined>(undefined);

// Fallback jobs in case database connection fails
const fallbackJobs: Job[] = [
  {
    id: 'fallback-1',
    title: 'Frontend Developer (Demo)',
    description: 'This is a demo job listing shown when database connection fails. In a real environment, you would see actual job postings here.',
    location: 'Remote',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    employerId: 'demo-employer',
    companyName: 'Demo Company',
    createdAt: new Date(),
    salary: '$80,000 - $120,000',
    jobType: 'Full-time'
  },
  {
    id: 'fallback-2',
    title: 'Backend Engineer (Demo)',
    description: 'This is a demo job listing shown when database connection fails. In a real environment, you would see actual job postings here.',
    location: 'New York, NY',
    skills: ['Node.js', 'PostgreSQL', 'Express'],
    employerId: 'demo-employer',
    companyName: 'Demo Tech',
    createdAt: new Date(),
    salary: '$90,000 - $140,000',
    jobType: 'Full-time'
  },
  {
    id: 'fallback-3',
    title: 'UI/UX Designer (Demo)',
    description: 'This is a demo job listing shown when database connection fails. In a real environment, you would see actual job postings here.',
    location: 'San Francisco, CA',
    skills: ['Figma', 'User Research', 'Prototyping'],
    employerId: 'demo-employer',
    companyName: 'Demo Design Co',
    createdAt: new Date(),
    salary: '$75,000 - $110,000',
    jobType: 'Full-time'
  }
];

// Provider component
export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state: authState } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [usingFallbackData, setUsingFallbackData] = useState<boolean>(false);

  // Load jobs function that can be called to reload jobs
  const fetchJobs = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallbackData(false);
      
      const response = await fetch(`${API_BASE_URL}/jobs`);
      
      if (!response.ok) {
        // Check for different error types
        if (response.status === 500) {
          throw new Error('Database connection issue. Please try again later.');
        } else {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      if (data) {
        const formattedJobs: Job[] = data.map((job: any) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          skills: job.skills,
          employerId: job.employerId,
          companyName: job.companyName || undefined,
          createdAt: new Date(job.createdAt),
          salary: job.salary || undefined,
          jobType: job.jobType || undefined
        }));
        setJobs(formattedJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      
      // Retry logic for connection issues (up to 2 retries)
      if (retryCount < 2) {
        console.log(`Retrying fetch (attempt ${retryCount + 1})...`);
        setTimeout(() => fetchJobs(retryCount + 1), 1000); // Wait 1 second before retry
        return;
      }
      
      // Show appropriate error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch jobs. Please check your connection.';
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Use fallback jobs to ensure app doesn't break completely
      console.log('Using fallback demo jobs due to database connection issue');
      setJobs(fallbackJobs);
      setUsingFallbackData(true);
    } finally {
      setLoading(false);
    }
  };

  // Reload jobs function exposed via context
  const reloadJobs = async () => {
    await fetchJobs();
    return;
  };

  // Load jobs on component mount and when auth state changes
  useEffect(() => {
    fetchJobs();
  }, [authState.isAuthenticated]); // Reload when auth state changes

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...jobs];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.companyName?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      result = result.filter(job => 
        job.location.toLowerCase().includes(locationTerm)
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      result = result.filter(job => 
        filters.skills!.some(skill => 
          job.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        )
      );
    }

    if (filters.jobType) {
      result = result.filter(job => 
        job.jobType === filters.jobType
      );
    }

    setFilteredJobs(result);
  }, [jobs, filters]);

  // Get a job by ID
  const getJobById = (id: string): Job | undefined => {
    return jobs.find(job => job.id === id);
  };

  // Get jobs by employer ID
  const getJobsByEmployer = (employerId: string): Job[] => {
    return jobs.filter(job => job.employerId === employerId);
  };

  // Create a new job
  const createJob = async (job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> => {
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('You must be logged in to create a job');
      }
      if (authState.user.role !== 'employer' && authState.user.role !== 'admin') {
        throw new Error('Only employers and admins can create jobs');
      }
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: job.title,
          description: job.description,
          location: job.location,
          skills: job.skills,
          employerId: job.employerId || authState.user.id,
          companyName: job.companyName,
          salary: job.salary,
          jobType: job.jobType
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      const data = await response.json();
      const newJob: Job = {
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        skills: data.skills,
        employerId: data.employerId,
        companyName: data.companyName || undefined,
        createdAt: new Date(data.createdAt),
        salary: data.salary || undefined,
        jobType: data.jobType || undefined
      };
      setJobs(prevJobs => [...prevJobs, newJob]);
      toast.success('Job created successfully!');
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create job');
      throw error;
    }
  };

  // Update a job
  const updateJob = async (id: string, jobUpdates: Partial<Job>): Promise<Job> => {
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('You must be logged in to update a job');
      }
      const job = getJobById(id);
      if (!job) {
        throw new Error('Job not found');
      }
      if (job.employerId !== authState.user.id && authState.user.role !== 'admin') {
        throw new Error('You do not have permission to update this job');
      }
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobUpdates),
      });
      if (!response.ok) {
        throw new Error('Failed to update job');
      }
      const data = await response.json();
      const updatedJob: Job = {
        id: data.id,
        title: data.title,
        description: data.description,
        location: data.location,
        skills: data.skills,
        employerId: data.employerId,
        companyName: data.companyName || undefined,
        createdAt: new Date(data.createdAt),
        salary: data.salary || undefined,
        jobType: data.jobType || undefined
      };
      setJobs(prevJobs => prevJobs.map(job => job.id === id ? updatedJob : job));
      toast.success('Job updated successfully!');
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
      throw error;
    }
  };

  // Delete a job
  const deleteJob = async (id: string): Promise<void> => {
    try {
      if (!authState.isAuthenticated || !authState.user) {
        throw new Error('You must be logged in to delete a job');
      }
      const job = getJobById(id);
      if (!job) {
        throw new Error('Job not found');
      }
      if (job.employerId !== authState.user.id && authState.user.role !== 'admin') {
        throw new Error('You do not have permission to delete this job');
      }
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete job');
      }
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      toast.success('Job deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
      throw error;
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        filteredJobs,
        loading,
        error,
        filters,
        setFilters,
        getJobById,
        getJobsByEmployer,
        createJob,
        updateJob,
        deleteJob,
        reloadJobs,
        usingFallbackData
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

// Custom hook for using the job context
export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
