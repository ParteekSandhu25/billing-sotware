// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useUser } from "./contexts/UserContext";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import CustomerHistory from "./pages/CustomerHistory";
import Products from "./pages/Products";
import Billing from "./pages/Billing";
import BillList from "./pages/BillList";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Reports from "./pages/Reports";

// ProtectedRoute component
const ProtectedRoute = ({ roles, children }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />; // redirect if role not allowed
  }

  return children;
};

export default function App() {
  const { user } = useUser();

  return (
    <Router>
      {!user ? (
        // If not logged in, show login page only
        <Routes>
          <Route path="/*" element={<Login />} />
        </Routes>
      ) : (
        // Logged in layout
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar />

          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customer/:id" element={<CustomerDetails />} />
              <Route path="/customer/:id/history" element={<CustomerHistory />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute roles={["owner", "staff"]}>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute roles={["owner"]}>
                    <Reports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute roles={["owner"]}>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/billing" element={<Billing />} />
              <Route path="/bills" element={<BillList />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}
