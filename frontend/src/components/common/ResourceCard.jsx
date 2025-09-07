import React from 'react';

const ResourceCard = ({ resource, onUnallocate }) => {
    console.log(resource);
  return (
    <div className="w-full bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">{resource.name}</h2>
        <p className="text-gray-600 text-sm mb-2">{resource.role}</p>
        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
          {resource.experience} years experience
        </span>
        <span className={`px-3 py-1 text-xs rounded-full ${resource.allocated ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
            {resource.allocated ? `Allocated: ${resource.project.name}` : 'Unallocated'}
        </span>

      </div>
      <button
        onClick={() => onUnallocate(resource.id)}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
      >
        Unallocate
      </button>
    </div>
  );
};

export default ResourceCard;
