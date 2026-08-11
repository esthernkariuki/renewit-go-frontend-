import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRecycle,
  FaBoxOpen,
  FaLayerGroup,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";

import { useDashboardData } from "../hooks/useDashboardData";

import "./style.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  /*
   * Get the username/phone saved during login.
   * We keep this as a fallback because the backend user lookup
   * may use either username or phone.
   */
  const storedUsername =
    localStorage.getItem("username") ||
    localStorage.getItem("phone") ||
    "";

  const {
    user,
    materials,
    products,
    loading,
    error,
  } = useDashboardData(token, storedUsername);

  const [search, setSearch] = useState("");

  /*
   * Redirect to login when there is no token.
   */
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /*
   * Hooks must always run before conditional returns.
   * These calculations are therefore done before loading/error
   * screens are returned.
   */

  const materialList = useMemo(() => {
    return Array.isArray(materials) ? materials : [];
  }, [materials]);

  const productList = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  /*
   * Try to get a name from the user returned by the backend.
   * Fall back to localStorage.
   */
  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.phone) return user.phone;

    /*
     * Sometimes the login response is stored as JSON
     * in localStorage under "user".
     */
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        return (
          parsedUser?.name ||
          parsedUser?.username ||
          parsedUser?.phone ||
          storedUsername ||
          "there"
        );
      }
    } catch (err) {
      console.warn("Could not read stored user:", err);
    }

    return storedUsername || "there";
  }, [user, storedUsername]);

  /*
   * Total material quantity.
   */
  const totalMaterials = useMemo(() => {
    return materialList.reduce(
      (total, material) =>
        total + Number(material?.quantity || 1),
      0
    );
  }, [materialList]);

  /*
   * Number of different material types.
   */
  const materialTypes = useMemo(() => {
    return new Set(
      materialList
        .map((material) => material?.type)
        .filter(Boolean)
        .map((type) => String(type).toLowerCase())
    ).size;
  }, [materialList]);

  /*
   * Total upcycled products.
   */
  const totalProducts = useMemo(() => {
    return productList.reduce(
      (total, product) =>
        total + Number(product?.quantity || 1),
      0
    );
  }, [productList]);

  /*
   * Material quantities grouped by type.
   */
  const materialTypeCounts = useMemo(() => {
    const counts = {};

    materialList.forEach((material) => {
      const type = material?.type || "Other";

      counts[type] =
        (counts[type] || 0) +
        Number(material?.quantity || 1);
    });

    return counts;
  }, [materialList]);

  /*
   * Recent activity.
   */
  const activities = useMemo(() => {
    const materialActivities = materialList.map((material) => ({
      activity: `${material?.quantity || 1} ${
        material?.type || "Material"
      } added`,
      type: material?.type || "Material",
      date:
        material?.listed_at ||
        material?.created_at ||
        "",
    }));

    const productActivities = productList.map((product) => ({
      activity: `${product?.quantity || 1} ${
        product?.type || "Product"
      } upcycled`,
      type: product?.type || "Product",
      date:
        product?.created_at ||
        product?.listed_at ||
        "",
    }));

    return [
      ...materialActivities,
      ...productActivities,
    ].sort((a, b) => {
      const dateA = a.date
        ? new Date(a.date).getTime()
        : 0;

      const dateB = b.date
        ? new Date(b.date).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [materialList, productList]);

  /*
   * Search recent activities.
   */
  const filteredActivities = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) {
      return activities;
    }

    return activities.filter((activity) => {
      return (
        activity.activity
          .toLowerCase()
          .includes(term) ||
        activity.type
          .toLowerCase()
          .includes(term)
      );
    });
  }, [activities, search]);

  /*
   * No token.
   */
  if (!token) {
    return null;
  }

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <main className="dashboard-main">
        <div className="dashboard-state">
          <div className="state-icon">
            <FaRecycle />
          </div>

          <h2>Loading dashboard...</h2>

          <p>
            Preparing your RenewIt dashboard.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error state.
   */
  if (error) {
    return (
      <main className="dashboard-main">
        <div className="dashboard-state error-state">
          <div className="state-icon">
            !
          </div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            type="button"
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-main">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="dashboard-heading">
        <div>
          <span className="eyebrow">
            RENEWIT
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Your circular economy overview
          </p>
        </div>
      </header>

      {/* =====================================
          WELCOME
      ====================================== */}

      <section className="welcome-card">
        <div className="welcome-content">
          <span className="welcome-label">
            Welcome back 
          </span>

          <h2>
            {displayName}!
          </h2>

          <p>
            Ready to renew, reuse and reimagine?
          </p>
        </div>

        <div className="welcome-logo">
  <img
    src="/images/renewit-logo.png"
    alt="RenewIt"
  />
</div>
      </section>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <section className="summary-grid">

        <article className="summary-card">
          <div className="summary-icon">
            <FaRecycle />
          </div>

          <div className="summary-content">
            <span>Total Materials</span>

            <strong>
              {totalMaterials}
            </strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon">
            <FaLayerGroup />
          </div>

          <div className="summary-content">
            <span>Material Types</span>

            <strong>
              {materialTypes}
            </strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon">
            <FaBoxOpen />
          </div>

          <div className="summary-content">
            <span>Upcycled Products</span>

            <strong>
              {totalProducts}
            </strong>
          </div>
        </article>

      </section>

      {/* =====================================
          MAIN OVERVIEW
      ====================================== */}

      <section className="dashboard-grid">

        {/* MATERIAL OVERVIEW */}

        <article className="dashboard-card material-card">

          <div className="card-header">
            <div>
              <span className="card-eyebrow">
                MATERIALS
              </span>

              <h2>
                Material Overview
              </h2>
            </div>

            <div className="card-header-icon">
              <FaRecycle />
            </div>
          </div>

          {Object.keys(materialTypeCounts).length > 0 ? (
            <div className="material-list">
              {Object.entries(materialTypeCounts)
                .slice(0, 5)
                .map(([type, quantity]) => (
                  <div
                    className="material-row"
                    key={type}
                  >
                    <div className="material-row-top">
                      <span>{type}</span>

                      <strong>
                        {quantity}
                      </strong>
                    </div>

                    <div className="material-bar">
                      <div
                        className="material-bar-fill"
                        style={{
                          width: `${Math.min(
                            quantity * 10,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <FaRecycle />

              <p>
                No materials available yet.
              </p>

              <button
                type="button"
                className="small-action-button"
                onClick={() =>
                  navigate("/requests")
                }
              >
                Add Material
                <FaArrowRight />
              </button>
            </div>
          )}
        </article>

        {/* PRODUCTS */}

        <article className="dashboard-card product-card">

          <div className="card-header">
            <div>
              <span className="card-eyebrow">
                MARKETPLACE
              </span>

              <h2>
                Upcycled Products
              </h2>
            </div>

            <div className="card-header-icon">
              <FaBoxOpen />
            </div>
          </div>

          <div className="product-number">
            {totalProducts}
          </div>

          <p className="product-description">
            {totalProducts === 1
              ? "upcycled product available"
              : "upcycled products available"}
          </p>

          <button
            type="button"
            className="outline-button"
            onClick={() =>
              navigate("/products")
            }
          >
            View Products
            <FaArrowRight />
          </button>
        </article>

      </section>

      {/* =====================================
          QUICK ACTIONS
      ====================================== */}

      <section className="quick-actions">

        <div className="quick-actions-heading">
          <span className="card-eyebrow">
            QUICK ACTIONS
          </span>

          <h2>
            Continue your journey
          </h2>
        </div>

        <div className="action-buttons">

          <button
            type="button"
            onClick={() =>
              navigate("/requests")
            }
          >
            <FaRecycle />

            <span>
              My Requests
            </span>

            <FaArrowRight />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/matched")
            }
          >
            <FaBoxOpen />

            <span>
              Browse Offers
            </span>

            <FaArrowRight />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            <FaLayerGroup />

            <span>
              My Products
            </span>

            <FaArrowRight />
          </button>

        </div>
      </section>

      {/* =====================================
          RECENT ACTIVITY
      ====================================== */}

      <section className="activity-card">

        <div className="activity-header">

          <div>
            <span className="card-eyebrow">
              ACTIVITY
            </span>

            <h2>
              Recent Activity
            </h2>

            <p>
              Your latest material and product activity.
            </p>
          </div>

          <div className="activity-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              aria-label="Search activity"
            />
          </div>

        </div>

        <div className="activity-table-wrapper">

          <table className="activity-table">

            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {filteredActivities.length > 0 ? (
                filteredActivities
                  .slice(0, 5)
                  .map((activity, index) => (
                    <tr key={`${activity.activity}-${index}`}>

                      <td>
                        <div className="activity-name">
                          <span className="activity-dot" />
                          {activity.activity}
                        </div>
                      </td>

                      <td>
                        <span className="activity-badge">
                          {activity.type}
                        </span>
                      </td>

                      <td>
                        {activity.date
                          ? new Date(
                              activity.date
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="no-activity"
                  >
                    <FaRecycle />

                    <span>
                      No recent activity found.
                    </span>
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}