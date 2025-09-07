import React from 'react';
import { Folder } from 'lucide-react';

const NoProjects = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 space-y-4">
      <Folder className="w-12 h-12 text-gray-400" />
      <h2 className="text-lg font-semibold">No Projects Found</h2>
      <p className="text-sm text-gray-400">Start by creating a new project or check back later.</p>
    </div>
  );
};

export default NoProjects;
