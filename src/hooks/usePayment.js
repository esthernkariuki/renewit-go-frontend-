import { useState } from "react";
import { createPayment } from "../utils/api/fetchPayment";

export default function usePayment() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const makePayment = async ({
    material_id,
    quantity,
    phone_number,
  }) => {
    try {
      setLoading(true);
      setError("");

      const result = await createPayment({
        material_id,
        quantity,
        phone_number,
      });

      setPayment(result);

      return result;
    } catch (err) {
      setError(
        err.message || "Payment failed."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    payment,
    loading,
    error,
    makePayment,
  };
}