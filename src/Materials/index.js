import React, { useState } from "react";
import useMaterials from "../hooks/useMaterials";
import { useNavigate } from "react-router-dom";
import "./style.css";

const API_BASE =process.env.REACT_APP_BASE_URL;

export default function Materials() {
  const {
    materials,
    loading,
    error,
    reloadMaterials,
  } = useMaterials();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("all");

  // =========================
  // IMAGE URL
  // =========================

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

  // =========================
  // FILTER MATERIALS
  // =========================

  const filteredMaterials = materials.filter((material) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      material.type
        ?.toLowerCase()
        .includes(searchValue) ||
      material.condition
        ?.toLowerCase()
        .includes(searchValue) ||
      material.trader?.name
        ?.toLowerCase()
        .includes(searchValue);

    const matchesCondition =
      conditionFilter === "all" ||
      material.condition?.toLowerCase() ===
        conditionFilter.toLowerCase();

    return matchesSearch && matchesCondition;
  });

  // =========================
  // CONDITIONS
  // =========================

  const conditions = [
    ...new Set(
      materials
        .map((material) => material.condition)
        .filter(Boolean)
    ),
  ];

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="materials-page">
        <div className="materials-loading">
          <div className="loading-spinner"></div>

          <h2>Loading available materials...</h2>

          <p>
            Please wait while we fetch materials from
            traders.
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="materials-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="materials-header">

        <div className="materials-eyebrow">
          MATERIAL MARKETPLACE
        </div>

        <h1>Available Materials</h1>

        <p>
          Browse materials posted by traders and find
          what you need for your upcycling work.
        </p>

      </header>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="materials-error">

          <div>
            <strong>Something went wrong</strong>

            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={reloadMaterials}
          >
            Try Again
          </button>

        </div>
      )}

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <section className="materials-toolbar">

        <div className="materials-search">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search materials, conditions or traders..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <select
          value={conditionFilter}
          onChange={(event) =>
            setConditionFilter(event.target.value)
          }
          className="condition-filter"
        >
          <option value="all">
            All Conditions
          </option>

          {conditions.map((condition) => (
            <option
              key={condition}
              value={condition}
            >
              {condition}
            </option>
          ))}
        </select>

      </section>

      {/* =========================
          RESULT COUNT
      ========================= */}

      <div className="materials-result-count">

        <span>
          {filteredMaterials.length}{" "}
          {filteredMaterials.length === 1
            ? "material"
            : "materials"}{" "}
          available
        </span>

      </div>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {filteredMaterials.length === 0 ? (

        <section className="materials-empty">

          <div className="materials-empty-icon">
            ♻
          </div>

          <h2>
            No materials found
          </h2>

          <p>
            {materials.length === 0
              ? "There are currently no materials listed by traders."
              : "Try changing your search or filter."}
          </p>

          {(search ||
            conditionFilter !== "all") && (
            <button
              type="button"
              className="clear-filter-button"
              onClick={() => {
                setSearch("");
                setConditionFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}

        </section>

      ) : (

        /* =========================
           MATERIAL CARDS
        ========================= */

        <section className="materials-grid">

          {filteredMaterials.map((material) => (

            <article
              className="material-card"
              key={material.id}
            >

              {/* IMAGE */}

              <div className="material-image-wrapper">

                {material.image ? (
                  <img
                    src={getImageUrl(material.image)}
                    alt={
                      material.type ||
                      "Material"
                    }
                    className="material-image"
                  />
                ) : (
                  <div className="material-no-image">

                    <span>♻</span>

                    <p>
                      No image available
                    </p>

                  </div>
                )}

              </div>

              {/* CARD CONTENT */}

              <div className="material-card-content">

                <div className="material-card-top">

                  <div>

                    <span className="material-label">
                      MATERIAL
                    </span>

                    <h2>
                      {material.type ||
                        "Unnamed Material"}
                    </h2>

                  </div>

                  <span className="material-condition">
                    {material.condition ||
                      "Unknown"}
                  </span>

                </div>

                {/* DETAILS */}

                <div className="material-details">

                  <div className="material-detail">

                    <span>
                      QUANTITY
                    </span>

                    <strong>
                      {material.quantity}
                    </strong>

                  </div>

                  <div className="material-detail">

                    <span>
                      CONDITION
                    </span>

                    <strong>
                      {material.condition ||
                        "—"}
                    </strong>

                  </div>

                </div>

                {/* TRADER */}

                <div className="material-trader">

                  <div className="trader-avatar">

                    {material.trader?.name
                      ? material.trader.name
                          .charAt(0)
                          .toUpperCase()
                      : "T"}

                  </div>

                  <div>

                    <span>
                      LISTED BY
                    </span>

                    <strong>
                      {material.trader?.name ||
                        "Trader"}
                    </strong>

                  </div>

                </div>

                {/* DATE */}

                <p className="material-date">

                  Listed{" "}

                  {material.listed_at
                    ? new Date(
                        material.listed_at
                      ).toLocaleDateString()
                    : "—"}

                </p>

                {/* ACTION */}

                <button
                  type="button"
                  className="view-material-button"
                  onClick={() => navigate(`/materials/${material.id}`)}
                >
                  View Material
                </button>

              </div>

            </article>

          ))}

        </section>

      )}

    </main>
  );
}