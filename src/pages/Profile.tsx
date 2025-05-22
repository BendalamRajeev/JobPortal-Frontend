import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from '@/utils/date';

// Profile components
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileOverview from '@/components/profile/ProfileOverview';
import JobSeekerApplications from '@/components/profile/JobSeekerApplications';
import EmployerJobs from '@/components/profile/EmployerJobs';
import AccountSettings from '@/components/profile/AccountSettings';
import LoadingSpinner from '@/components/profile/LoadingSpinner';
import AdminUsers from '@/components/profile/AdminUsers';

const Profile = () => {
  const { state } = useAuth();
  const { applications, loading: appLoading } = useApplications();
  const { user } = state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Filter applications for the current user
  const userApplications = user ? applications.filter(app => app.userId === user.id) : [];

  useEffect(() => {
    // Redirect if not authenticated
    if (!state.isAuthenticated) {
      navigate("/login");
      return;
    }

    // Set loading to false once we have authentication state
          setLoading(false);
  }, [state.isAuthenticated, navigate]);

  if (loading || appLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-job-purple-700 bg-card">
          <CardContent className="pt-6">
            <p className="text-foreground">Please log in to view your profile.</p>
            <Button onClick={() => navigate('/login')} className="mt-4 neon-button">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <ProfileHeader user={user} />

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {user.role === 'jobseeker' && (
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          )}
          {user.role === 'employer' && (
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          )}
          {user.role === 'admin' && (
            <>
              <TabsTrigger value="alljobs">All Jobs</TabsTrigger>
              <TabsTrigger value="users">Manage Users</TabsTrigger>
            </>
          )}
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ProfileOverview user={user} formatDate={formatDate} />
        </TabsContent>

        {user.role === 'jobseeker' && (
          <TabsContent value="applications">
            <JobSeekerApplications applications={userApplications} />
          </TabsContent>
        )}

        {user.role === 'employer' && (
          <TabsContent value="jobs">
            <EmployerJobs />
          </TabsContent>
        )}

        {user.role === 'admin' && (
          <>
            <TabsContent value="alljobs">
              <EmployerJobs isAdmin={true} />
            </TabsContent>
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
          </>
        )}

        <TabsContent value="settings">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
