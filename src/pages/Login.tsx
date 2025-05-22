import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    
    try {
      setLoading(true);
      await login(email, password);
      // Navigation will happen from the auth context effect
    } catch (error) {
      console.error('Login error:', error);
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
          <h1 className="mb-2 text-3xl font-bold neon-text">Welcome Back</h1>
          <p className="text-foreground">Sign in to your JobPortal account</p>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-job-neon-400 hover:text-job-purple-400"
                >
                  Forgot password?
                </Link>
              </div>
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
            
            <Button 
              type="submit" 
              className="w-full neon-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Logging in...
                </>
              ) : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-job-neon-400 hover:text-job-purple-400">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
