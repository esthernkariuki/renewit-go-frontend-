import { useCallback, useEffect, useState } from "react";
import { fetchMaterials } from "../utils/api/fetchMaterialsApi";

export default function useMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await fetchMaterials();

      if (Array.isArray(result)) {
        setMaterials(result);
      } else if (Array.isArray(result?.data)) {
        setMaterials(result.data);
      } else if (Array.isArray(result?.materials)) {
        setMaterials(result.materials);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      setError(
        err.message || "Failed to load materials."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadMaterials();
  }, [loadMaterials]);

  return {
    materials,
    loading,
    error,
    reloadMaterials: loadMaterials,
  };
}