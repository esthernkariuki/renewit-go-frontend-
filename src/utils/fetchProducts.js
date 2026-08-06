const API_BASE = process.env.REACT_APP_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Token ${token}`,
  };
};

export const fetchProducts = (page = 1) =>
  
  fetch(`${API_BASE}upcycled-products/?page=${page}`, {   
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      Accept: 'application/json',
    },
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    })
    .catch(error => {
      throw new Error(error.message ?? "Failed to fetch products");
    });
