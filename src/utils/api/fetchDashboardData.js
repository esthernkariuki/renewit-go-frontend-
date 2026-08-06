const API_ROOT = process.env.REACT_APP_BASE_URL;

export async function fetchUsersList(token) {
  try {
    const response = await fetch(`${API_ROOT}users/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json", },});
      if (!response.ok) {
      throw new Error("Failed to fetch users");}
      return await response.json();}
    catch (error) {
    throw error;
  }
}


export async function fetchCurrentUserData(token) {
  try {
    const response = await fetch(`${API_ROOT}users/me/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      }, });

      if (!response.ok) {
      throw new Error("Failed to fetch current user"); }
      return await response.json();}
   catch (error) {
    throw error;
  }
}

export function findUserByUsernameOrEmail(users, username) {
const normalizedUsername = username.toLowerCase().trim();
const user = users.find((u) =>
u.user?.username?.toLowerCase() === normalizedUsername ||
u.user?.email?.toLowerCase() === normalizedUsername
);
if (!user) throw new Error("User not found");
return user;
}


export async function fetchRequests(token) {
  try {
    const response = await fetch(`${API_ROOT}upcycler-requests/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",},});
    if (!response.ok) {
      throw new Error("Failed to fetch requests");}
    return await response.json();}
  catch (error) {
  throw error;
  }
}

export async function fetchBarData(token) {
  try {
    const response = await fetch(`${API_ROOT}upcycled-products/`, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json",},});
    if (!response.ok) {
      throw new Error("Failed to fetch bar data");}
    return await response.json();}
  catch (error) {
  throw error;
  }
}

