const API_BASE =
  process.env.REACT_APP_BASE_URL;

export async function createPayment(paymentData) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API_BASE}payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      material_id: paymentData.material_id,
      quantity: paymentData.quantity,
      phone_number: paymentData.phone_number,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create payment.");
  }

  return data;
}