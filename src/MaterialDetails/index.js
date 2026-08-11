import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";

import "./style.css";

const API_BASE =process.env.REACT_APP_BASE_URL;

export default function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE.replace(/\/$/, "")}/${image.replace(
      /^\//,
      ""
    )}`;
  };

  // =====================================================
  // LOAD MATERIAL
  // =====================================================

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE}materials`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
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
        setError(
          err.message || "Failed to load material."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [id, navigate]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="material-details-page">
        <div className="material-details-loading">
          Loading material...
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="material-details-page">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/materials")}
        >
          <FaArrowLeft />
          Back to Materials
        </button>

        <div className="material-details-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/materials")}
          >
            Back to Materials
          </button>
        </div>
      </main>
    );
  }

  if (!material) {
    return null;
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="material-details-page">

      {/* BACK */}

      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/materials")}
      >
        <FaArrowLeft />
        Back to Materials
      </button>

      {/* HEADER */}

      <header className="material-details-header">
        <p className="material-details-eyebrow">
          MATERIAL DETAILS
        </p>

        <h1>
          {material.type || "Unnamed Material"}
        </h1>

        <p>
          Review the material details before making
          your purchase.
        </p>
      </header>

      {/* DETAILS */}

      <section className="material-details-card">

        {/* IMAGE */}

        <div className="material-details-image">

          {material.image ? (
            <img
              src={getImageUrl(material.image)}
              alt={material.type || "Material"}
            />
          ) : (
            <div className="material-details-no-image">
              <span>♻</span>
              <p>No image available</p>
            </div>
          )}

        </div>

        {/* INFORMATION */}

        <div className="material-details-content">

          <div className="material-details-top">

            <div>
              <span className="details-label">
                MATERIAL
              </span>

              <h2>
                {material.type || "Unnamed Material"}
              </h2>
            </div>

            <span className="details-condition">
              {material.condition || "Unknown"}
            </span>

          </div>

          {/* PRICE */}

          <div className="material-price-section">

            <span>PRICE</span>

            <strong>
              KSh{" "}
              {Number(
                material.price || 0
              ).toLocaleString()}
            </strong>

          </div>

          {/* INFORMATION GRID */}

          <div className="material-info-grid">

            <div>
              <span>QUANTITY AVAILABLE</span>
              <strong>
                {material.quantity}
              </strong>
            </div>

            <div>
              <span>CONDITION</span>
              <strong>
                {material.condition || "—"}
              </strong>
            </div>

          </div>

          {/* TRADER */}

          <div className="material-trader-details">

            <div className="trader-avatar-large">
              {material.trader?.name
                ? material.trader.name
                    .charAt(0)
                    .toUpperCase()
                : "T"}
            </div>

            <div>
              <span>LISTED BY</span>

              <strong>
                {material.trader?.name || "Trader"}
              </strong>
            </div>

          </div>

          {/* DATE */}

          <p className="material-listed-date">
            Listed{" "}
            {material.listed_at
              ? new Date(
                  material.listed_at
                ).toLocaleDateString()
              : "—"}
          </p>

          {/* BUY */}

          <button
  type="button"
  className="buy-material-button"
  onClick={() => navigate(`/payment/${material.id}`)}
>
  <FaShoppingCart />
  Buy Material
</button>

        </div>

      </section>

    </main>
  );
}