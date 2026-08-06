import React, { useState, useMemo } from "react";
import { useMaterials } from "../hooks/useMaterials";
import { clothTypes,navigationData } from "../utils/api/fetchMaterial";
import "./style.css";

export default function ViewMatched() {
  const {
    selectedCloth,
    selectCloth,
    clearSelection,
    materials,
    loading,
    error,
  } = useMaterials();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(clothTypes.length / pageSize));
  const paginatedClothTypes = clothTypes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const groupedMaterials = useMemo(() => {
    const groups = materials.reduce((acc, material) => {
      const key = material.type || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(material);
      return acc;
    }, {});
    Object.values(groups).forEach((items) => {
      items.sort((a, b) => {
        const matA = typeof a.material === "string" ? a.material.toLowerCase() : "";
        const matB = typeof b.material === "string" ? b.material.toLowerCase() : "";
        return matA.localeCompare(matB);
      });
    });
    return groups;
  }, [materials]);

  const allMaterials = useMemo(() => Object.values(groupedMaterials).flat(), [groupedMaterials]);
  const materialPageSize = 10;
  const paginatedMaterials = allMaterials.slice(
    (currentPage - 1) * materialPageSize,
    currentPage * materialPageSize
  );

  const groupedPaginatedMaterials = useMemo(() => {
    return paginatedMaterials.reduce((acc, material) => {
      const key = material.type || "Unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(material);
      return acc;
    }, {});
  }, [paginatedMaterials]);

  const goToPrevPage = () => {
    setCurrentPage((p) => (p > 1 ? p - 1 : p));
  };

  const goToNextPage = () => {
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  };

  return (
    <main style={{ flex: 1, padding: "20px" }}>
      {!selectedCloth ? (
        <>
          <div className="cloth-grid">
            {paginatedClothTypes.map((type, index) => {
              const globalIndex = (currentPage - 1) * pageSize + index;
              const isLastTwo = globalIndex >= clothTypes.length - 2;
              return (
                <div
                  key={type}
                  onClick={() => selectCloth(type)}
                  className={`cloth-card ${isLastTwo ? "align-start" : ""}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") selectCloth(type);
                  }}
                >
                  <img src={navigationData[type].image} alt={type} />
                  <strong>{type}</strong>
                </div>
              );
            })}
          </div>

          <div className="paginationContainer">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="paginationButton"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="paginationInfo" aria-live="polite" aria-atomic="true">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="paginationButton"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div>
          <BackIcon onClick={clearSelection} />
          <h2 className="materials-heading">Materials for {selectedCloth}</h2>
          <img
            src={navigationData[selectedCloth]?.image}
            alt={selectedCloth}
            className="selected-image"
          />
          {loading && (
            <p style={{ textAlign: "center", fontStyle: "italic" }}>
              Loading materials...
            </p>
          )}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && allMaterials.length === 0 && (
            <p style={{ textAlign: "center" }}>
              No materials found for this cloth type yet.
            </p>
          )}
          {!loading &&
            !error &&
            allMaterials.length > 0 &&
            Object.entries(groupedPaginatedMaterials).map(([type, items]) => (
              <div key={type} className="material-group">
                <h3>{type}</h3>
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Quantity</th>
                      <th>Condition</th>
                      <th>Listed At</th>
                      <th>Trader</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.material}</td>
                        <td>{item.quantity}</td>
                        <td>{item.condition}</td>
                        <td>{new Date(item.listed_at).toLocaleDateString()}</td>
                        <td>{item.trader}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}

function BackIcon({ onClick }) {
  return (
    <div style={{ marginLeft: "20%", marginBottom: "25px" }}>
      <svg
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
        width="60"
        height="60"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Go back"
        style={{ cursor: "pointer", color: "#383838" }}
        className="back-icon-large"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </div>
  );
}
