import { useState, useEffect } from "react";
import { fetchBarData } from "../utils/api/fetchDashboardData";

export function useBarChart(token, refreshFlag) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function loadBarData() {
      setLoading(true);
      setError(null);
      try {
        const barData = await fetchBarData(token);
        const latestData = Array.isArray(barData)
          ? barData.sort((a, b) => new Date(b.requested_at) - new Date(a.requested_at)) : [];
        if (isMounted) setData(latestData); 
      } catch (err) {
        if (isMounted) setError("Failed to load bar data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBarData();

    return () => {
      isMounted = false;
    }; }, [token, refreshFlag]);

  return { data, loading, error };
}