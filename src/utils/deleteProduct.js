const API_BASE = process.env.REACT_APP_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Token ${token}`,
  };
};

export const deleteProduct = (id) =>
  
  fetch(`${API_BASE}upcycled-products/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to delete product');
    })
    .catch(error => {
      throw new Error(error.message ?? "Failed to delete");
    });

