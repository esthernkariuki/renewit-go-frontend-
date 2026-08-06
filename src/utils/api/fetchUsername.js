const API_ROOT = process.env.REACT_APP_BASE_URL;

export async function fetchCurrentUser(token, username) {
  try {
    const response = await fetch(`${API_ROOT}users/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");}
    const users = await response.json();

    const foundUser =users.find(
        (user) =>user.username && user.username.toLowerCase() === username.toLowerCase()) || null;

        return foundUser;}
  catch (error) {
    throw error;}};

