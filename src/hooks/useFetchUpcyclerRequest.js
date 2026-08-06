import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../utils/fetchUpcyclerRequest';
import { addProduct } from '../utils/postUpcyclerRequest';
import { deleteProduct } from '../utils/deleteUpcyclerRequest';
import { updateProduct } from '../utils/updateUpcyclerRequest';

export function useUpcyclerRequests() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProducts(page)
      .then((data) => {
        if (Array.isArray(data)) setRequests(data);
        else if (Array.isArray(data.results)) setRequests(data.results);
        else setRequests([]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch upcycler requests');
        setLoading(false);
      });
  }, [page]);

  const add = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const newRequest = await addProduct(formData);
      setRequests((prev) => [newRequest, ...prev]);
    } catch (err) {
      setError(err.message || 'Failed to add request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (requestId, formData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProduct(requestId, formData);
      setRequests((prev) => prev.map((r) => (r.request === requestId ? updated : r)));
    } catch (err) {
      setError(err.message || 'Failed to update request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(requestId);
      setRequests((prev) => prev.filter((r) => r.request !== requestId));
    } catch (err) {
      setError(err.message || 'Failed to delete request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requests,
    loading,
    error,
    page,
    setPage,
    add,
    update,
    remove,
  };
}


