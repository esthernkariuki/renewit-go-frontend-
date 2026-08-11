const API_ROOT = process.env.REACT_APP_BASE_URL;

export const signUpUser = async ({ name, phone, password, role }) => {
  try {
    const response = await fetch(`${API_ROOT}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};