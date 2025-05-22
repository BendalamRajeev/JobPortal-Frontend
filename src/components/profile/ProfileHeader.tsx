import React from 'react';
import { User } from '@/types';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <Card className="mb-8 border-job-purple-700 bg-card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-job-purple-500">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-job-purple-900 text-job-neon-400">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl text-job-purple-400">{user.name || 'User'}</CardTitle>
            <p className="text-foreground">{user.email}</p>
            <div className="mt-1">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-job-purple-900/50 text-job-neon-400 capitalize">
                {user.role}
              </span>
              {user.company && (
                <span className="ml-2 inline-block px-2 py-1 text-xs font-medium rounded-full bg-job-neon-900/50 text-job-neon-400">
                  {user.company}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
