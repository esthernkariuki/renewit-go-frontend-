const API_ROOT = process.env.REACT_APP_BASE_URL;

/**
 * Get all users.
 * We use the logged-in token and then find
 * the current user using the username stored
 * during login.
 */
export async function fetchUsers(token) {
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_ROOT}users`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch users (${response.status})`
    );
  }

  return await response.json();
}

/**
 * Get materials.
 */
export async function fetchMaterials(token) {
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_ROOT}materials`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch materials (${response.status})`
    );
  }

  const data = await response.json();

  return Array.isArray(data)
    ? data
    : data?.materials || [];
}

/**
 * Get upcycled products.
 */
export async function fetchUpcycledProducts(token) {
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_ROOT}upcycled-products`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch upcycled products (${response.status})`
    );
  }

  const data = await response.json();

  return Array.isArray(data)
    ? data
    : data?.products || [];
}