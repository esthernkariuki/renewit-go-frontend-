const API_ROOT = process.env.REACT_APP_BASE_URL;

export async function loginUser({ phone, password }) {
  if (!phone || !password) {
    throw new Error("Phone number and password are required");
  }

  try {
    const response = await fetch(`${API_ROOT}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        Phone: phone,
        Password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error ||
        data?.message ||
        "Invalid phone number or password"
      );
    }

    if (!data?.token || typeof data.token !== "string") {
      throw new Error("Login successful, but no authentication token was returned");
    }

    /*
     * Save the token.
     */
    localStorage.setItem("token", data.token);

    /*
     * Save the phone because login is done using
     * phone number, not username.
     */
    localStorage.setItem("loginPhone", phone);

    /*
     * If the backend already returns user information,
     * save it too.
     */
    const returnedUser =
      data.user ||
      data.data?.user ||
      data;

    if (returnedUser?.name) {
      localStorage.setItem("userName", returnedUser.name);
    }

    if (returnedUser?.username) {
      localStorage.setItem("username", returnedUser.username);
    }

    return {
      token: data.token,
      user: returnedUser,
      phone,
    };
  } catch (error) {
    throw error;
  }
}