const ProjectModal = ({ isOpen, onClose, project, mode, onResignMember, onReallocate }) => {
  if (!isOpen || !project) return null;

  const handleResignAll = () => {
    if (!project.members) return;
    project.members.forEach(member => onResignMember(project.id, member.id));
  };

  const handleReallocate = () => {
    if (onReallocate) onReallocate(project.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 w-full max-w-lg rounded-lg shadow-lg p-6 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
        <p className="text-gray-300 mb-4">{project.description}</p>
        <p className="mb-4 text-sm text-gray-400">Project ID: #{project.id}</p>

        {mode === 'resign' && (
          <>
            <h3 className="text-lg font-semibold mb-2">Members</h3>
            {project.members && project.members.length > 0 ? (
              <div className="space-y-2">
                {project.members.map((res) => (
                  <div
                    key={res.id}
                    className="flex justify-between items-center bg-gray-800 p-2 rounded"
                  >
                    <div>
                      <span className="font-medium">{res.name}</span> -{' '}
                      <span className="text-sm text-gray-400">{res.role}</span>
                    </div>
                    <button
                      onClick={() => onResignMember(project.id, res.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Unassign
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleResignAll}
                  className="mt-4 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Resign All Members
                </button>
              </div>
            ) : (
              <p className="text-gray-400">No members assigned</p>
            )}
          </>
        )}

        {mode === 'reallocate' && (
          <>
            <h3 className="text-lg font-semibold mb-2">Members</h3>
            {project.members && project.members.length > 0 ? (
              <div className="space-y-2">
                {project.members.map((res) => (
                  <div
                    key={res.id}
                    className="bg-gray-800 p-2 rounded"
                  >
                    <span className="font-medium">{res.name}</span> -{' '}
                    <span className="text-sm text-gray-400">{res.role}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No members assigned</p>
            )}

            <button
              onClick={handleReallocate}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Recommend Resources
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default ProjectModal;
