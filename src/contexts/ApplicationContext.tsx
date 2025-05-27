
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Application, ApplicationStatus } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// API base URL
const API_BASE_URL = 'https://job-portal-backend-8goo.onrender.com';

// Define the Application Context type
interface ApplicationContextType {
  applications: Application[];
  loading: boolean;
  error: string | null;
  getUserApplications: (userId: string) => Application[];
  getJobApplications: (jobId: string) => Application[];
  createApplication: (application: Omit<Application, 'id' | 'appliedAt' | 'status'>) => Promise<Application>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<Application>;
  deleteApplication: (id: string) => Promise<void>;
  reloadApplications: () => Promise<void>;
}

// Create the context
const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

// Provider component
export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state: authState } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to reload applications that can be called from outside
  const reloadApplications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Only fetch if user is authenticated
      if (!authState.isAuthenticated || !authState.token) {
        setApplications([]);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch applications');
      }
      
      const data = await response.json();
      
      // Convert string dates to Date objects
      const formattedApplications = data.map((app: any) => ({
        ...app,
        appliedAt: new Date(app.appliedAt)
      }));
      
      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Load applications on component mount or when auth state changes
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Only fetch if user is authenticated
        if (!authState.isAuthenticated || !authState.token) {
          setApplications([]);
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/applications`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to fetch applications');
        }
        
        const data = await response.json();
        
        // Convert string dates to Date objects
        const formattedApplications = data.map((app: any) => ({
          ...app,
          appliedAt: new Date(app.appliedAt)
        }));
        
        setApplications(formattedApplications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [authState.isAuthenticated, authState.token]);

  // Get applications by user ID
  const getUserApplications = (userId: string): Application[] => {
    return applications.filter(application => application.userId === userId);
  };

  // Get applications by job ID
  const getJobApplications = (jobId: string): Application[] => {
    return applications.filter(application => application.jobId === jobId);
  };

  // Create a new application
  const createApplication = async (
    application: Omit<Application, 'id' | 'appliedAt' | 'status'>
  ): Promise<Application> => {
    try {
      // Ensure user is authenticated
      if (!authState.isAuthenticated || !authState.token) {
        throw new Error('You must be logged in to submit an application');
      }

      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify(application),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create application');
      }
      
      const data = await response.json();
      
      // Convert string date to Date object
      const newApplication: Application = {
        ...data,
        appliedAt: new Date(data.appliedAt),
      };
      
      setApplications(prevApplications => [...prevApplications, newApplication]);
      toast.success('Application submitted successfully!');
      return newApplication;
    } catch (error) {
      console.error('Error creating application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create application';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update an application status
  const updateApplicationStatus = async (
    id: string,
    status: ApplicationStatus
  ): Promise<Application> => {
    try {
      // Ensure user is authenticated
      if (!authState.isAuthenticated || !authState.token) {
        throw new Error('You must be logged in to update application status');
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update application status');
      }
      
      const data = await response.json();
      
      // Convert string date to Date object
      const updatedApplication: Application = {
        ...data,
        appliedAt: new Date(data.appliedAt),
      };
      
      setApplications(prevApplications => 
        prevApplications.map(application => 
          application.id === id ? updatedApplication : application
        )
      );
      
      toast.success(`Application status updated to ${status}.`);
      return updatedApplication;
    } catch (error) {
      console.error('Error updating application status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update application status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Delete an application
  const deleteApplication = async (id: string): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!authState.isAuthenticated || !authState.token) {
        throw new Error('You must be logged in to withdraw an application');
      }

      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete application');
      }
      
      setApplications(prevApplications => 
        prevApplications.filter(application => application.id !== id)
      );
      
      toast.success('Application withdrawn successfully.');
    } catch (error) {
      console.error('Error deleting application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete application';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };


  return (
    <ApplicationContext.Provider value={{
      applications,
      loading,
      error,
      getUserApplications,
      getJobApplications,
      createApplication,
      updateApplicationStatus,
      deleteApplication,
      reloadApplications
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Custom hook for using the application context
export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
