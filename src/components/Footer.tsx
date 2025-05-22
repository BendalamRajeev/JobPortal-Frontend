import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-job-purple-800 bg-background py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold neon-text">JobPortal</h3>
            <p className="text-sm text-foreground">
              Connecting talented professionals with the best companies around the world.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-job-purple-400">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="text-foreground hover:text-job-neon-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="text-foreground hover:text-job-neon-400 transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="text-foreground hover:text-job-neon-400 transition-colors">Login</Link></li>
              <li><Link to="/applications" className="text-foreground hover:text-job-neon-400 transition-colors">Job Applications</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-job-purple-400">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/post-job" className="text-foreground hover:text-job-neon-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/manage-jobs" className="text-foreground hover:text-job-neon-400 transition-colors">Manage Jobs</Link></li>
              <li><Link to="/register" className="text-foreground hover:text-job-neon-400 transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="text-foreground hover:text-job-neon-400 transition-colors">Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase text-job-purple-400">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-foreground">rajeevbendalam@gmail.com</li>
              <li className="text-foreground">+91 8328397110</li>
              <li className="text-foreground">Centurion University, Vizianagaram</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-job-purple-800/50 pt-8 text-center text-sm text-foreground/70">
          <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
