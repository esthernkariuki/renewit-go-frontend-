const API_BASE = process.env.REACT_APP_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Token ${token}`,
  };
};

export const updateProduct = async (id, formData) => {
  const response = await fetch(`${API_BASE}upcycler-requests/${id}/`, {
    method: 'PUT',
    headers: getAuthHeaders(), 
    body: formData,            
  });

  if (!response.ok) {
    let message = 'Failed to update upcycler request';
    try {
      const errorData = await response.json();
      if (errorData && errorData.detail) message = errorData.detail;
      else if (typeof errorData === 'object') message = JSON.stringify(errorData);
    } catch {}
    throw new Error(message);
  }
  return response.json();
};
