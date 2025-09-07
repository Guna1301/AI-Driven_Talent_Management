import { Users } from 'lucide-react';

const NoResources = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 space-y-4">
      <Users className="w-12 h-12 text-gray-400" />
      <h2 className="text-lg font-semibold">No Resources Found</h2>
      <p className="text-sm text-gray-400">Add some resources to get started.</p>
    </div>
  );
};

export default NoResources;
