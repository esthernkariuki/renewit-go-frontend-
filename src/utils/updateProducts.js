const API_BASE = process.env.REACT_APP_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Token ${token}`,
  };
};

export const updateProduct = (id, formData) =>
  
  fetch(`${API_BASE}upcycled-products/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,

  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update product');
      return res.json();
    })
    .catch(error => {
      throw new Error(error.message ?? "Couldn't update products");
    });

