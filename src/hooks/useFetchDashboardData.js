import { useState, useEffect } from "react";
import { fetchUsersList, findUserByUsernameOrEmail, fetchCurrentUserData } from "./utils/fetchDashboardData";

export function useFetchDashboardData(token, username) {
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!token || typeof token !== "string" || token.trim() === "") {
      setUserName(null);
      setError(err.message ||"No valid token provided");
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        let user;
        if (!username || username === "me") {
          user = await fetchCurrentUserData(token);
        } else {
          const users = await fetchUsersList(token);
          user = findUserByUsernameOrEmail(users, username);
        }}
      catch (err) {
        if (!isMounted) return;
        setUserName(null);
        setError(err.message ||"Failed to fetch user data");}
      finally {
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