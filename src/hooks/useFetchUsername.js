import { useState, useEffect } from "react";
import { fetchCurrentUser } from "../utils/api/fetchUsername"; 

export function useFetchUsername(token, username) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!token || typeof token !== "string" || token.trim() === "") {
      if (isMounted) {
        setUserData(null);
        setError(err.message || "No valid token provided");
        setLoading(false);
      }
      return;
    }

    if (!username || typeof username !== "string" || username.trim() === "") {
      if (isMounted) {
        setUserData(null);
        setError("No valid username provided");
        setLoading(false);
      }
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await fetchCurrentUser(token, username);
        if (!user) {
          throw new Error("User not found");
        }
        if (isMounted) {
          setUserData(user);
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setUserData(null);
        setError(err.message ||"Failed to fetch user data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [token, username]);

  return { userData, loading, error };
}