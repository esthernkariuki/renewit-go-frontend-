const API_BASE = process.env.REACT_APP_BASE_URL;

const getAuthToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    Authorization: `Token ${token}`,  
  };
};

export const addProduct = async (formData) => {
  const response = await fetch(`${API_BASE}upcycler-requests/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,            
  });

  if (!response.ok) {
    let message = 'Failed to add upcycler requests';
    try {
      const errorData = await response.json();
      if (errorData && errorData.detail) message = errorData.detail;
      else if (typeof errorData === "object") message = JSON.stringify(errorData);
    } catch {}
    throw new Error(message);
  }
  return response.json();
};
