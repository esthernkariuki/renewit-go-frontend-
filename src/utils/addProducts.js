const API_BASE = process.env.REACT_APP_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Token ${token}`,
  };
};

export const addProduct = (formData) =>
  
  fetch(`${API_BASE}upcycled-products/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to add product');
      return res.json();
    })
    .catch(error => {
      throw new Error(error.message ?? "Failed to add");
    });

