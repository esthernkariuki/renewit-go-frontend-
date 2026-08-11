import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import WelcomePage from "./Welcome";
import SignupPage from "./SignUp";
import SigninPage from "./SignIn";
import Dashboard from "./Dashboard";
import { Sidebar } from "./Sharedcomponents/Sidebar";
import ProductList from "./Products";
import Materials from "./Materials";
import MaterialDetails from "./MaterialDetails";
import Payment from "./Payment";
import "./App.css";

export function Layout() {
  const location = useLocation();

  const showSidebar = !["/", "/signup", "/login"].includes(
    location.pathname
  );

  return (
    <div className={`app-layout ${showSidebar ? "with-sidebar" : ""}`}>
      {showSidebar && <Sidebar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<SigninPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/materials/:id" element={<MaterialDetails />}/>
          <Route path="/payment/:id" element={<Payment />}/>
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}