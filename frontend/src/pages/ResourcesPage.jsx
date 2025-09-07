import { useEffect, useState } from "react";
import NoResources from "../components/common/NoResources";
import ResourceCard from "../components/common/ResourceCard";
import { dummyResources } from "../constants/constants";
import axiosInstance from "../services/axiosInstance";
import useFetch from "../hooks/useFetch";

const ResourcesPage = () => {
  const { data, loading: fetchLoading, error: fetchError } = useFetch('/resources/');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setResources(data);
      setLoading(false);
    } else if (!fetchLoading && fetchError) {
      setResources(dummyResources);
      setLoading(false);
      setError(fetchError);
    }
  }, [data, fetchLoading, fetchError]);

  const handleUnallocate = async (resourceId) => {
    try {
      await axiosInstance.post('/unallocate', { resourceId });
      setResources((prev) => prev.filter((res) => res.id !== resourceId));
      alert('Resource unallocated successfully');
    } catch (err) {
      console.error(err);
      alert('Something went wrong while unallocating');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!resources || resources.length === 0) return <NoResources />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resources</h1>
      <div className="space-y-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onUnallocate={handleUnallocate}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
