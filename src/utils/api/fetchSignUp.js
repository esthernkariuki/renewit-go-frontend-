const API_ROOT = process.env.REACT_APP_BASE_URL;
export const signUpUser = async ({ username, name, email, phone, password, role }) => {
  try {
    const response = await fetch(`${API_ROOT}register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { username, email, password },
        name,
        phone,
        role,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      const errorText = data.message || JSON.stringify(data) || "Signup failed";
      throw new Error(errorText);
    }
     return data;}
  catch (error) {
  throw error;
  }
};
