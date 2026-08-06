import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import WelcomePage from "./Welcome";
import SignupPage from "./SignUp";
import SigninPage from "./SignIn";
import Dashboard from "./Dashboard";
import { Sidebar } from "./Sharedcomponents/Sidebar";
import ProductList from "./Products";
import UpcyclerRequests from "./UpcyclerRequests";
import ViewMatched from "./ViewMatched";
import "./App.css";

export function Layout() {
  const location = useLocation();
  const showSidebar = !["/", "/signup", "/login"].includes(location.pathname);

  return (
    <div className="app-layout">
      {showSidebar && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<SigninPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/requests" element= {<UpcyclerRequests/>}/>
          <Route path="/matched" element={<ViewMatched />} />  
        </Routes>
      </div>
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