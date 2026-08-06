import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../utils/fetchProducts';
import { addProduct } from '../utils/addProducts';
import { deleteProduct } from '../utils/deleteProduct';
import { updateProduct } from '../utils/updateProducts';

export function useProducts() {
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProducts(page)

      .then((data) => {


        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.results)) setProducts(data.results);
        else setProducts([]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      });
  }, [page]);

  const add = useCallback(
    
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const newProduct = await addProduct(formData);
        setProducts((prev) => [newProduct, ...prev]);
      } catch (err) {
        setError(err.message || 'Failed to add product');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const update = useCallback(
    async (id, formData) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateProduct(id, formData);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch (err) {
        setError(err.message || 'Failed to update product');
        throw err;
      } finally {
        setLoading(false);
        
      }
    },
    []
  );


  const remove = useCallback(

    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete product');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    products,
    loading,
    error,
    page,
    setPage,
    add,
    update,
    remove,
  };
}