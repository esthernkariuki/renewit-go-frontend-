const API_BASE = process.env.REACT_APP_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// =========================
// GET PRODUCTS
// =========================
export const fetchProducts = async (page = 1) => {
  const response = await fetch(
    `${API_BASE}upcycled-products?page=${page}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error ||
        data.message ||
        "Failed to fetch products"
    );
  }

  return response.json();
};

// =========================
// ADD PRODUCT
// =========================
export const addProduct = async (formData) => {
  const response = await fetch(
    `${API_BASE}upcycled-products`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error ||
        data.message ||
        "Failed to add product"
    );
  }

  return response.json();
};

// =========================
// UPDATE PRODUCT
// =========================
export const updateProduct = async (id, formData) => {
  const response = await fetch(
    `${API_BASE}upcycled-products/${id}`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error ||
        data.message ||
        "Failed to update product"
    );
  }

  return response.json();
};

// =========================
// DELETE PRODUCT
// =========================
export const deleteProduct = async (id) => {
  const response = await fetch(
    `${API_BASE}upcycled-products/${id}`,
    {
      method: "DELETE",
      headers: {
        ...getAuthHeaders(),
      },
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.error ||
        data.message ||
        "Failed to delete product"
    );
  }

  return true;
};