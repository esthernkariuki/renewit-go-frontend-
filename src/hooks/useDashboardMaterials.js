import { useEffect, useState } from "react";

import {
  fetchDashboardMaterials,
} from "../utils/api/fetchDashboardData";

export function useDashboardMaterials(token) {
  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMaterials() {
      if (!token) {
        if (isMounted) {
          setMaterials([]);
          setError("No authentication token found");
          setLoading(false);
        }

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await fetchDashboardMaterials(token);

        if (isMounted) {
          setMaterials(
            Array.isArray(data) ? data : []
          );
        }
      } catch (err) {
        console.error(
          "Dashboard materials error:",
          err
        );

        if (isMounted) {
          setMaterials([]);
          setError(
            err.message ||
              "Failed to load materials"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMaterials();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return {
    materials,
    loading,
    error,
  };
}