import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { toast } from 'sonner';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('jobseeker');
  const [loading, setLoading] = useState(false);
  const { state, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password should be at least 6 characters.');
      return;
    }
    
    try {
      setLoading(true);
      await register(email, password, role);
      // Navigation will happen from the auth context effect
    } catch (error) {
      console.error('Registration error:', error);
      // The error toast is shown in the auth context
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, redirect to home
  if (state.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold neon-text">Create an Account</h1>
          <p className="text-foreground">Join JobPortal to start your journey</p>
        </div>
        
        <div className="rounded-lg border border-job-purple-700 bg-card p-6 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background text-foreground border-job-purple-700 focus:border-job-neon-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background text-foreground border-job-purple-700 focus:border-job-neon-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-background text-foreground border-job-purple-700 focus:border-job-neon-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">I am a...</Label>
              <RadioGroup 
                defaultValue={role} 
                onValueChange={(value) => setRole(value as UserRole)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jobseeker" id="jobseeker" className="border-job-purple-500 text-job-neon-400" />
                  <Label htmlFor="jobseeker" className="cursor-pointer text-foreground">Job Seeker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employer" id="employer" className="border-job-purple-500 text-job-neon-400" />
                  <Label htmlFor="employer" className="cursor-pointer text-foreground">Employer</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full neon-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Creating Account...
                </>
              ) : 'Register'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-job-neon-400 hover:text-job-purple-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
