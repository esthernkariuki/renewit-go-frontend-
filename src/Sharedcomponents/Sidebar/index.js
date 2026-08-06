import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaList, FaShoppingCart, FaTags, FaSignOutAlt } from "react-icons/fa";
import "./style.css";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <div className={`dashboard-container`}>
        <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-logo-row">
            <img src="images/logo.png" alt="RenewIt Logo" className="sidebar-logo" />
            <span className="sidebar-title" style={{ fontWeight: 700, fontStyle: "italic" }}>
              RenewIt
            </span>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  onClick={closeSidebar} >
                  <FaHome /> Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  onClick={closeSidebar}
                >
                  <FaList /> My Request
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/matched"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  onClick={closeSidebar}
                >
                  <FaTags /> Browse Offers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  onClick={closeSidebar}
                >
                  <FaShoppingCart /> My product
                </NavLink>
              </li>
            
              <li>
                <button
                  type="button"
                  className="nav-link logout-button"
                  onClick={() => {
                    closeSidebar();
                    handleLogout();
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </>
  );
}


export const ProfileIcon = () => (
<div className="profile-icon">
<i className="fas fa-user"></i>
</div>
)