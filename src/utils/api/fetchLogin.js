const API_ROOT = process.env.REACT_APP_BASE_URL;

export const loginUser = async ({ username, password }) => {
  try {
    const response = await fetch(`${API_ROOT}login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }), });
    if (!response.ok) {
      throw new Error("Login failed");}

    const data = await response.json();
    if (!data.token || typeof data.token !== "string") {
      throw new Error("Invalid server response: Token missing or invalid");}

    return {
      token: data.token,
      username: data.username || username,};
  } catch (error) {
    throw error;
  }
};



