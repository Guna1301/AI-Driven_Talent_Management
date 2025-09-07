import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(url);
        setData(res.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'error in fetching data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
