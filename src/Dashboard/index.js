import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileIcon } from "../Sharedcomponents/Sidebar";
import MultiSeriesBarChart from "../Sharedcomponents/MultiSeriesBarChart";
import { useFetchUseList } from "../hooks/useFetchUserList";
import { useRequests } from "../hooks/useRequests";
import { useBarChart } from "../hooks/useBarChart";
import "./style.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5; 
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const {
    userName,
    loading: loadingUser,
    error: userError,
  } = useFetchUseList(token, username);
  const { data: myRequests, loading: loadingRequests, error: errorRequests } = useRequests(token);
  const { data: barData, loading: loadingBar, error: errorBar } = useBarChart(token);

  if (!token) return null;

  const loading = loadingUser || loadingRequests || loadingBar;
  const error = userError || errorRequests || errorBar;

  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;

  const myRequestsArray = Array.isArray(myRequests) ? myRequests : [];
  const barDataArray = Array.isArray(barData) ? barData : [];

  const totalRequestsCount = myRequestsArray.reduce(
    (sum, req) => sum + (req.quantity || 0),
    0
  );
  const distinctRequestTypes = new Set(myRequestsArray.map((req) => req.type)).size;
  const totalProductsCount = barDataArray.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const summary = [
    { title: "Total Requests", count: totalRequestsCount },
    { title: "Request Types", count: distinctRequestTypes },
    { title: "Total Products", count: totalProductsCount },
  ];

  const chartData = barDataArray.map((item) => ({
    label: item.type || "",
    value: item.quantity,
  }));

  const recent = myRequestsArray.map((req) => ({
    activity: `${req.quantity} ${req.type} requested`,
    type: req.type,
    date: req.requested_at
      ? req.requested_at.split("T")[0].replace(/-/g, "/")
      : new Date().toISOString().split("T")[0].replace(/-/g, "/"),
  }));

  const filteredRecent = recent.filter(
    (rec) =>
      rec.activity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.date?.includes(searchTerm)
  );

  const totalItems = filteredRecent.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecent = filteredRecent.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  function handleSearchClick() {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  }

  function handleSearchKeyPress(e) {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  }

  return (
    <div className="dashboard-layout">
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2>Dashboard Overview</h2>
          <ProfileIcon />
        </div>

        <div className="welcome-row">Welcome {userName || username || "User"}!</div>

        <div className="dashboard-summary-cards">
          {summary.map((item, idx) => (
            <div className="summary-card" key={idx}>
              <div className="summary-title">{item.title}</div>
              <div className="summary-count">{item.count}</div>
            </div>
          ))}
        </div>

        <div className="dashboard-row">
          <div className="dashboard-analytics">
            <div className="analytics-card">
              <div className="analytics-title">Order Source Overview</div>
            </div>
          </div>

          <div className="dashboard-analytics">
            <div className="analytics-card">
              <div className="analytics-title">Upcycled Products</div>
              <MultiSeriesBarChart data={chartData} />
            </div>
          </div>
        </div>

        <div className="dashboard-row">
          <div className="recent-activity-card">
            <div className="analytics-title">Recent Activities</div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1em",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  className="search-input"
                  aria-label="Search activities"
                />
              </div>

            </div>

            <table className="recent-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecent.length > 0 ? (
                  paginatedRecent.map((rec, idx) => (
                    <tr key={idx}>
                      <td>{rec.activity}</td>
                      <td>{rec.type}</td>
                      <td>{rec.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div
              className="pagination-controls"
              style={{
                marginTop: "1em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                style={{
                  backgroundColor: currentPage === 1 ? "white" : "#2E6600",
                  color: currentPage === 1 ? "#" : "white",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Previous
              </button>

              <span style={{ fontWeight: "bold" }}>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                style={{
                  backgroundColor:
                    currentPage === totalPages || totalPages === 0 ? "#e0e0e0" : "#2E6600",
                  color: currentPage === totalPages || totalPages === 0 ? "#888" : "white",
                  cursor:
                    currentPage === totalPages || totalPages === 0 ? "not-allowed" : "pointer",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
