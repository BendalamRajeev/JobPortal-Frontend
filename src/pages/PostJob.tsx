import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { createJob } = useJobs();
  const { state } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [companyName, setCompanyName] = useState(state.user?.company || '');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.user) {
      toast.error('You must be logged in to post a job');
      return;
    }
    
    try {
      setLoading(true);
      
      const skillsArray = skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      await createJob({
        title,
        description,
        location,
        skills: skillsArray,
        employerId: state.user.id,
        companyName: companyName || state.user.company || 'Unknown Company',
        salary,
        jobType
      });
      
      toast.success('Job posted successfully!');
      navigate('/manage-jobs');
    } catch (error) {
      toast.error('Failed to post job. Please try again.');
      console.error('Error posting job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Post a New Job</h1>
      
      <div className="rounded-lg border border-job-purple-700 bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
                required
                className="job-form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Tech Solutions Inc."
                required
                className="job-form-input"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA or Remote"
                required
                className="job-form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <select
                id="jobType"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="job-form-select"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range (Optional)</Label>
              <Input
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g., Rs.1,00,000 - Rs.1,30,000"
                className="job-form-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills *</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, TypeScript, CSS (comma separated)"
                required
                className="job-form-input"
              />
              <p className="text-xs text-foreground/70">
                Enter skills separated by commas
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job responsibilities, requirements, and company details..."
              className="job-form-textarea"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/manage-jobs')}
              disabled={loading}
              className="border border-job-purple-400 bg-white text-job-purple-600 hover:text-job-neon-400 hover:bg-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="enhanced-neon-button"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-job-purple-600 border-t-transparent"></span>
                  Posting Job...
                </>
              ) : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
