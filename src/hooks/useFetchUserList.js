import { useState, useEffect } from "react";
import { fetchUsersList,findUserByUsernameOrEmail } from "../utils/api/fetchUsersList";

export function useFetchUseList(token, username) {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !username) {
      setUserName(null);
      setError("No valid token or username provided");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchUser() {
      try {
        const users = await fetchUsersList(token);
        const currentUser = findUserByUsernameOrEmail(users, username);

        if (isMounted) {
          setUserName(currentUser.name || currentUser.user.username|| "User");
          setError(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setUserName(null);
        setError(err.message || "Failed to fetch user data");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [token, username]);

  return { userName, loading, error };
}