import { useState, useEffect } from "react";
import { fetchRequests } from "../utils/api/fetchDashboardData";

export function useRequests(token, refreshFlag) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !token.trim()) {
      setData([]);
      setError("No valid token provided");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadRequests() {
      setLoading(true);
      setError(null);
      try {
        const requestsData = await fetchRequests(token);
        if (isMounted) setData(requestsData);
      } catch (err) {
        if (isMounted) setError(err.message ||"Failed to fetch requests");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, [token, refreshFlag]); 

  return { data, loading, error };
}