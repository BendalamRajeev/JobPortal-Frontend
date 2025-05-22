import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  const { isAuthenticated, user } = state;

  // Navigation with error handling
  const handleNavigate = (path: string) => () => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Unable to navigate to the requested page. Please try again later.');
    }
  };

  const renderAuthLinks = () => {
    if (isAuthenticated && user) {
      return (
        <div className="flex items-center gap-4">
          {user.role === 'jobseeker' && (
            <>
              <Button variant="ghost" onClick={handleNavigate('/jobs')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                Browse Jobs
              </Button>
              <Button variant="ghost" onClick={handleNavigate('/applications')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                My Applications
              </Button>
            </>
          )}

          {user.role === 'employer' && (
            <>
              <Button variant="ghost" onClick={handleNavigate('/manage-jobs')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                My Jobs
              </Button>
              <Button variant="ghost" onClick={handleNavigate('/post-job')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                Post Job
              </Button>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Button variant="ghost" onClick={handleNavigate('/admin/jobs')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                Manage Jobs
              </Button>
              <Button variant="ghost" onClick={handleNavigate('/admin/users')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
                Manage Users
              </Button>
            </>
          )}

          <Button variant="ghost" onClick={handleNavigate('/profile')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
            Profile
          </Button>
          <Button 
            onClick={() => {
              logout();
              handleNavigate('/')();
            }} 
            className="job-listing-button border border-red-400 bg-white text-red-600 hover:text-red-400 hover:bg-white"
          >
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleNavigate('/jobs')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
          Browse Jobs
        </Button>
        <Button variant="ghost" onClick={handleNavigate('/login')} className="text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">
          Login
        </Button>
        <Button onClick={handleNavigate('/register')} className="enhanced-neon-button">
          Sign Up
        </Button>
      </div>
    );
  };

  return (
    <nav className="border-b border-job-purple-700 shadow-md bg-background/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold neon-text">
            JobPortal
          </Link>
        </div>
        {renderAuthLinks()}
      </div>
    </nav>
  );
};

export default Navbar;
