import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <Card>
        <CardContent className="p-6">
          {/* Add your settings content here */}
          <p>Settings page content</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;