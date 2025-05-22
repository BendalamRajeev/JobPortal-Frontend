import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/date';

const API_BASE_URL = 'http://localhost:8000';

const AdminUsers: React.FC = () => {
  const { state } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${state.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        // Convert string dates to Date objects
        const formattedUsers = data.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt)
        }));
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
      setLoading(false);
      }
    };
    
    if (state.isAuthenticated && state.user?.role === 'admin') {
    loadUsers();
    }
  }, [state.isAuthenticated, state.user, state.token]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-900/50 text-red-400';
      case 'employer':
        return 'bg-job-purple-900/50 text-job-purple-400';
      case 'jobseeker':
        return 'bg-job-neon-900/50 text-job-neon-400';
      default:
        return 'bg-job-neutral-800/50 text-job-neutral-300';
    }
  };

  if (!state.isAuthenticated || state.user?.role !== 'admin') {
    return (
      <Card className="border-job-purple-700 bg-card">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-400">Access denied. Admin privileges required.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-job-purple-700 bg-card">
      <CardHeader>
        <CardTitle className="text-job-purple-400">Manage Users</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-job-purple-300 border-t-job-neon-400"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-job-purple-700">
                  <th className="px-4 py-2 text-left text-foreground">Name/Email</th>
                  <th className="px-4 py-2 text-left text-foreground">Role</th>
                  <th className="px-4 py-2 text-left text-foreground">Joined</th>
                  <th className="px-4 py-2 text-left text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-job-purple-700/50 hover:bg-job-purple-900/20">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{user.name || user.company || 'Unknown'}</p>
                        <p className="text-sm text-foreground/70">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold capitalize ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/70">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-job-purple-500 text-foreground hover:text-job-neon-400 hover:bg-job-purple-900/20">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminUsers;
