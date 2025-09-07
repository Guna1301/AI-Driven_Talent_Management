import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/common/ProjectCard';
import ProjectModal from '../components/common/ProjectModel';
import axiosInstance from '../services/axiosInstance';
import useFetch from '../hooks/useFetch';

const ProjectsPage = () => {
  const { data, loading, error } = useFetch('/projects/');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (data) setProjects(data);
  }, [data]);

  const handleResign = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) setSelectedProject({ ...project, mode: 'resign' });
  };

  const handleReallocate = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) setSelectedProject({ ...project, mode: 'reallocate' });
  };

  const handleUnassignMember = async (projectId, memberId) => {
    try {
      await axiosInstance.post('/unassign', { projectId, memberId });
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId
            ? { ...p, members: p.members.filter(m => m.id !== memberId) }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to unassign member');
    }
  };

  const handleResignAll = async (project) => {
    if (!project.members || project.members.length === 0) return;
    try {
      await Promise.all(
        project.members.map(member =>
          axiosInstance.post('/unassign', { projectId: project.id, memberId: member.id })
        )
      );
      setProjects(prev =>
        prev.map(p =>
          p.id === project.id ? { ...p, members: [], status: 'Resigned' } : p
        )
      );
      setSelectedProject(null);
      alert('All members resigned successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to resign all members');
    }
  };

  const handleReallocateResource = async (projectId) => {
    try {
      await axiosInstance.post('/reallocate', { projectId });
      alert('Resources reallocated successfully');
      setSelectedProject(null);
    } catch (err) {
      console.error(err);
      alert('Failed to reallocate resources');
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <div className="space-y-4">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onResign={handleResign}
            onReallocate={handleReallocate}
          />
        ))}
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
        mode={selectedProject?.mode}
        onResignMember={handleUnassignMember}
        onReallocate={handleReallocateResource}
        onResignAll={handleResignAll}
      />
    </div>
  );
};

export default ProjectsPage;
