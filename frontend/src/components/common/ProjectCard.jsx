import React from 'react';

const ProjectCard = ({ project, onResign, onReallocate }) => {

  const handleResign = () => {
    if (onResign) onResign(project.id);
  };

  const handleReallocate = () => {
    if (onReallocate) onReallocate(project.id);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow hover:shadow-md transition p-6 mb-2">
      <h2 className="text-xl font-bold mb-3 text-gray-800">{project.name}</h2>
      <p className='text-gray-500 text-sm mb-2'>#{project.id}</p>
      <p className="text-gray-600 mb-4">{project.description}</p>

      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 text-xs rounded-full ${
          project.status === 'Active' ? 'bg-green-100 text-green-800' :
          project.status === 'Completed' ? 'bg-gray-200 text-gray-800' :
          project.status === 'Resigned' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status}
        </span>

        <div className="flex gap-2">
          <button
            onClick={handleResign}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          >
            Resign Resources
          </button>

          <button
            onClick={handleReallocate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Recommend Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
