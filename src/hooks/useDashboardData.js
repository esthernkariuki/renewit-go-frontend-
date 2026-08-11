import { useEffect, useState } from "react";
import {
  fetchUsers,
  fetchMaterials,
  fetchUpcycledProducts,
} from "../utils/api/fetchDashboardData";

export function useDashboardData(token, username) {
  const [user, setUser] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!token) {
        if (isMounted) {
          setLoading(false);
          setError("No authentication token found");
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          users,
          materialsData,
          productsData,
        ] = await Promise.all([
          fetchUsers(token),
          fetchMaterials(token),
          fetchUpcycledProducts(token),
        ]);

        /*
         * Find logged-in user.
         *
         * Login stores username in localStorage.
         */
        let currentUser = null;

        if (username) {
          const normalizedUsername =
            username.toLowerCase().trim();

          currentUser =
            users.find((item) => {
              const itemUsername =
                item?.username ||
                item?.user?.username ||
                "";

              const itemPhone =
                item?.phone ||
                item?.user?.phone ||
                "";

              return (
                itemUsername.toLowerCase() ===
                  normalizedUsername ||
                itemPhone === username
              );
            }) || null;
        }

        if (isMounted) {
          setUser(currentUser);
          setMaterials(
            Array.isArray(materialsData)
              ? materialsData
              : []
          );

          setProducts(
            Array.isArray(productsData)
              ? productsData
              : []
          );
        }
      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err
        );

        if (isMounted) {
          setError(
            err.message ||
              "Failed to load dashboard"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [token, username]);

  return {
    user,
    materials,
    products,
    loading,
    error,
  };
}