import { useState, useEffect, useCallback } from "react";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../utils/api/fetchProductsApi";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts(page);

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.results)) {
        setProducts(data.results);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(
        err.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // =========================
  // ADD PRODUCT
  // =========================
  const add = useCallback(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const newProduct = await addProduct(formData);

      setProducts((prev) => [
        newProduct,
        ...prev,
      ]);

      return newProduct;
    } catch (err) {
      setError(
        err.message || "Failed to add product"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // UPDATE PRODUCT
  // =========================
  const update = useCallback(
    async (id, formData) => {
      setLoading(true);
      setError(null);

      try {
        const updatedProduct =
          await updateProduct(id, formData);

        setProducts((prev) =>
          prev.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...updatedProduct,
                }
              : product
          )
        );

        return updatedProduct;
      } catch (err) {
        setError(
          err.message ||
            "Failed to update product"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =========================
  // DELETE PRODUCT
  // =========================
  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await deleteProduct(id);

      setProducts((prev) =>
        prev.filter(
          (product) => product.id !== id
        )
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete product"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    page,
    setPage,
    add,
    update,
    remove,
    reload: loadProducts,
  };
}