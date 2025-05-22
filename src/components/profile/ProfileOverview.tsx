import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileOverviewProps {
  user: User;
  formatDate: (dateValue: Date | string) => string;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user, formatDate }) => {
  return (
    <Card className="border-job-purple-700 bg-card">
      <CardHeader>
        <CardTitle className="text-job-purple-400">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-job-purple-400">Email</h4>
            <p className="text-foreground">{user.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-job-purple-400">Role</h4>
            <p className="capitalize text-foreground">{user.role}</p>
          </div>
          {user.company && (
            <div>
              <h4 className="text-sm font-medium text-job-purple-400">Company</h4>
              <p className="text-foreground">{user.company}</p>
            </div>
          )}
          <div>
            <h4 className="text-sm font-medium text-job-purple-400">Member Since</h4>
            <p className="text-foreground">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
