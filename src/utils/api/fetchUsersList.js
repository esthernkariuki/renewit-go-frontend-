const API_ROOT = process.env.REACT_APP_BASE_URL;

export async function fetchUsersList(token) {
  try {
    if (!token) {
      throw new Error("No valid token provided");}
    const response = await fetch(`${API_ROOT}users/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");}
    const users = await response.json();
    return users;}
   catch (error) {
   throw error;
  }
}



export function findUserByUsernameOrEmail(users, username) {
  if (!username) throw new Error("No valid username provided");
  const normalizedUsername = username.toLowerCase().trim();
  const user = users.find(
    (u) =>u.user?.username?.toLowerCase() === normalizedUsername );
  if (!user) throw new Error("User not found");

  return user;
}
