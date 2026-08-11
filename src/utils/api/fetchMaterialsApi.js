const API_BASE =process.env.REACT_APP_BASE_URL;

// =========================
// AUTH HEADERS
// =========================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// =========================
// GET MATERIALS
// =========================

export const fetchMaterials = async () => {
  const response = await fetch(
    `${API_BASE}materials`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => ({}));

    throw new Error(
      data.error ||
        data.message ||
        "Failed to load materials"
    );
  }

  return response.json();
};