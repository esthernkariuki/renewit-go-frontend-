import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaRecycle,
  FaBoxOpen,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "./style.css";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        type="button"
        className="mobile-menu-button"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* BRAND */}

        <div className="sidebar-brand">

          <img
            src="/images/renewit-logo.png"
            alt="RenewIt"
            className="brand-logo"
          />

          <div className="brand-text">

            <span className="brand-name">
              RenewIt
            </span>

            <span className="brand-tagline">
              Circular marketplace
            </span>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          <p className="sidebar-section-title">
            MENU
          </p>

          <ul className="sidebar-list">

            {/* DASHBOARD */}

            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeSidebar}
              >
                <FaHome className="sidebar-icon" />

                <span>
                  Dashboard
                </span>
              </NavLink>
            </li>

            {/* MATERIALS */}

            <li>
              <NavLink
                to="/materials"
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeSidebar}
              >
                <FaRecycle className="sidebar-icon" />

                <span>
                  Materials
                </span>
              </NavLink>
            </li>

            {/* MY PRODUCTS */}

            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
                onClick={closeSidebar}
              >
                <FaBoxOpen className="sidebar-icon" />

                <span>
                  My Products
                </span>
              </NavLink>
            </li>

          </ul>

          {/* ACCOUNT */}

          <p className="sidebar-section-title account-title">
            ACCOUNT
          </p>

          <ul className="sidebar-list">

            <li>
              <button
                type="button"
                className="sidebar-link logout-button"
                onClick={() => {
                  closeSidebar();
                  handleLogout();
                }}
              >
                <FaSignOutAlt className="sidebar-icon" />

                <span>
                  Logout
                </span>
              </button>
            </li>

          </ul>

        </nav>

        {/* FOOTER */}

        <div className="sidebar-footer">

          <div className="footer-icon">
            ♻
          </div>

          <div>

            <p>
              Renew. Reuse. Reimagine.
            </p>

            <span>
              Building a circular Kenya
            </span>

          </div>

        </div>

      </aside>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export const ProfileIcon = () => {
  return null;
};