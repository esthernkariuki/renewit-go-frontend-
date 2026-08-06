import { useState, useEffect } from "react";
import { fetchCurrentUserData } from "../utils/apiUtils";

export function useFetchSignIn(token) {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setUserName(null);
      setError(null);
      setLoading(false);
      return;
    }

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCurrentUserData(token);
        setUserName(data.username ||null);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
        setUserName(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  return { userName, loading, error };
}