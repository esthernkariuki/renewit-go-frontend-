import { useState, useEffect } from "react";
import { fetchMaterials } from "../utils/api/fetchMaterial";

export function useMaterials() {
  const [selectedCloth, setSelectedCloth] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedCloth) {
      setMaterials([]);
      setLoading(false);
      setError(null);
      return;
    }

    const loadMaterials = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMaterials(selectedCloth);
        setMaterials(data);
      } catch (err) {
        setError(err.message || "Error fetching materials");
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [selectedCloth]);

  function selectCloth(cloth) {
    setSelectedCloth(cloth);
  }

  function clearSelection() {
    setSelectedCloth(null);
    setMaterials([]);
    setError(null);
    setLoading(false);
  }

  return {
    selectedCloth,
    selectCloth,
    clearSelection,
    materials,
    loading,
    error,
  };
}
