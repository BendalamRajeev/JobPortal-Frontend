import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccountSettings: React.FC = () => {
  return (
    <Card className="border-job-purple-700 bg-card">
      <CardHeader>
        <CardTitle className="text-job-purple-400">Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">Account settings features will be available soon.</p>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
