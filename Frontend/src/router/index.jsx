import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import SellerRegister from "../pages/SellerRegister";
import SellerUpload from "../pages/SellerUpload";
import SellerWaiting from "../pages/SellerWaiting";

import ProtectedSeller from "./ProtectedSeller";

/* ===== PROTECTOR LOGIN & ROLE ===== */
function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  // belum login
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // role tidak sesuai
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function Router() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* USER */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* USER → DAFTAR SELLER */}
      <Route
        path="/seller/register"
        element={
          <ProtectedRoute>
            <SellerRegister />
          </ProtectedRoute>
        }
      />

      {/* SELLER WAITING */}
      <Route
        path="/seller/waiting"
        element={
          <ProtectedRoute>
            <SellerWaiting />
          </ProtectedRoute>
        }
      />

      {/* SELLER DASHBOARD */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedSeller>
            <SellerUpload />
          </ProtectedSeller>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
