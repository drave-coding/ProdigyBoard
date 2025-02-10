import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Adjust the import based on your folder structure

interface WorkInProgressProps {
  label: string;
}

const WorkInProgress: React.FC<WorkInProgressProps> = ({ label }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-sm mx-auto shadow-lg">
        <CardHeader>
          <h1 className="text-xl font-bold text-center">
            {label} Section
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700">
            This page is currently under construction. Please check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkInProgress;
