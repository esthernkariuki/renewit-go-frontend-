import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaMobileAlt,
  FaLock,
} from "react-icons/fa";

import usePayment from "../hooks/usePayment";

import "./style.css";

const API_BASE = process.env.REACT_APP_BASE_URL;

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [materialError, setMaterialError] = useState("");

  const {
    payment,
    loading: paymentLoading,
    error: paymentError,
    makePayment,
  } = usePayment();

  // =====================================================
  // LOAD MATERIAL
  // =====================================================

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);
        setMaterialError("");

        const response = await fetch(
          `${API_BASE.replace(/\/$/, "")}/materials`
        );

        if (!response.ok) {
          throw new Error("Failed to load material.");
        }

        const result = await response.json();

        let materials = [];

        if (Array.isArray(result)) {
          materials = result;
        } else if (Array.isArray(result?.data)) {
          materials = result.data;
        } else if (Array.isArray(result?.materials)) {
          materials = result.materials;
        }

        const foundMaterial = materials.find(
          (item) => String(item.id) === String(id)
        );

        if (!foundMaterial) {
          throw new Error("Material not found.");
        }

        setMaterial(foundMaterial);
      } catch (err) {
        setMaterialError(
          err.message || "Failed to load material."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [id]);

  // =====================================================
  // QUANTITY
  // =====================================================

  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(1, previous - 1)
    );
  };

  const increaseQuantity = () => {
    if (!material) return;

    setQuantity((previous) =>
      Math.min(
        Number(material.quantity) || 1,
        previous + 1
      )
    );
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const pricePerUnit = Number(material?.price || 0);

  const total = pricePerUnit * quantity;

  // =====================================================
  // PHONE NUMBER
  // =====================================================

  const handlePhoneChange = (event) => {
    const value = event.target.value;

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = async () => {
    if (!phoneNumber.trim()) {
      return;
    }

    try {
      await makePayment({
        material_id: Number(id),
        quantity,
        phone_number: phoneNumber,
      });
    } catch (err) {
      // Error is already handled by usePayment.
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="payment-page">
        <div className="payment-loading">
          <div className="payment-spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </main>
    );
  }

  // =====================================================
  // MATERIAL ERROR
  // =====================================================

  if (materialError || !material) {
    return (
      <main className="payment-page">

        <button
          type="button"
          className="payment-back-button"
          onClick={() =>
            navigate(`/materials/${id}`)
          }
        >
          <FaArrowLeft />
          Back to Material
        </button>

        <div className="payment-error">
          <h2>Something went wrong</h2>

          <p>
            {materialError ||
              "Material not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(`/materials/${id}`)
            }
          >
            Back to Material
          </button>
        </div>

      </main>
    );
  }

  // =====================================================
  // SUCCESS / PAYMENT CREATED
  // =====================================================

  if (payment) {
    return (
      <main className="payment-page">

        <div className="payment-success-card">

          <div className="success-icon">
            ✓
          </div>

          <p className="payment-eyebrow">
            PAYMENT INITIATED
          </p>

          <h1>
            Check Your Phone
          </h1>

          <p className="success-message">
            An M-Pesa payment prompt has
            been sent to:
          </p>

          <strong className="success-phone">
            {phoneNumber}
          </strong>

          <div className="success-amount">
            <span>Amount</span>

            <strong>
              KSh {total.toLocaleString()}
            </strong>
          </div>

          <p className="success-instruction">
            Enter your M-Pesa PIN on your
            phone to complete the payment.
          </p>

          <button
            type="button"
            className="success-back-button"
            onClick={() =>
              navigate(`/materials/${id}`)
            }
          >
            Back to Material
          </button>

        </div>

      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="payment-page">

      {/* BACK */}

      <button
        type="button"
        className="payment-back-button"
        onClick={() =>
          navigate(`/materials/${id}`)
        }
      >
        <FaArrowLeft />
        Back to Material
      </button>

      {/* HEADER */}

      <header className="payment-header">

        <p className="payment-eyebrow">
          SECURE CHECKOUT
        </p>

        <h1>
          Purchase Material
        </h1>

        <p>
          Complete your purchase securely
          using M-Pesa.
        </p>

      </header>

      {/* PAYMENT CARD */}

      <section className="payment-card">

        {/* MATERIAL SUMMARY */}

        <div className="payment-material">

          <div className="payment-material-icon">
            ♻
          </div>

          <div className="payment-material-info">

            <span>
              MATERIAL
            </span>

            <h2>
              {material.type ||
                "Unnamed Material"}
            </h2>

            <p>
              {material.condition ||
                "Condition unavailable"}
            </p>

          </div>

        </div>

        {/* PRICE */}

        <div className="payment-price-row">

          <span>
            Price per unit
          </span>

          <strong>
            KSh{" "}
            {pricePerUnit.toLocaleString()}
          </strong>

        </div>

        {/* AVAILABLE */}

        <div className="payment-price-row">

          <span>
            Available
          </span>

          <strong>
            {material.quantity} units
          </strong>

        </div>

        <div className="payment-divider" />

        {/* QUANTITY */}

        <div className="payment-quantity-section">

          <label>
            Quantity
          </label>

          <div className="quantity-control">

            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <FaMinus />
            </button>

            <span>
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={
                quantity >=
                Number(material.quantity)
              }
              aria-label="Increase quantity"
            >
              <FaPlus />
            </button>

          </div>

        </div>

        {/* TOTAL */}

        <div className="payment-total">

          <span>
            Total
          </span>

          <strong>
            KSh {total.toLocaleString()}
          </strong>

        </div>

        {/* PHONE NUMBER */}

        <div className="phone-section">

          <label htmlFor="phoneNumber">
            M-Pesa Phone Number
          </label>

          <div className="phone-input-wrapper">

            <FaMobileAlt />

            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              placeholder="0712121212"
              maxLength={12}
              value={phoneNumber}
              onChange={handlePhoneChange}
            />

          </div>

          <small>
            You will receive an M-Pesa
            payment prompt on this number.
          </small>

        </div>

        {/* PAYMENT ERROR */}

        {paymentError && (
          <div className="payment-inline-error">
            {paymentError}
          </div>
        )}

        {/* PAY BUTTON */}

        <button
          type="button"
          className="pay-button"
          onClick={handlePayment}
          disabled={
            paymentLoading ||
            !phoneNumber.trim()
          }
        >
          {paymentLoading ? (
            <>
              <span className="button-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              Pay KSh {total.toLocaleString()}
            </>
          )}
        </button>

        {/* SECURITY */}

        <div className="payment-security">

          <FaLock />

          <span>
            Secure M-Pesa payment
          </span>

        </div>

      </section>

    </main>
  );
}