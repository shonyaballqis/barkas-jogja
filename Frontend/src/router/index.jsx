import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import SellerRegister from "../pages/SellerRegister";
import SellerUpload from "../pages/SellerUpload";

/* ===== PROTECTOR ===== */
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
          <ProtectedRoute role="user">
            <Home />
          </ProtectedRoute>
        }
      />

      {/* SELLER REGISTER */}
      <Route
        path="/seller/register"
        element={
          <ProtectedRoute role="user">
            <SellerRegister />
          </ProtectedRoute>
        }
      />

      {/* SELLER UPLOAD */}
      <Route
        path="/seller/upload"
        element={
          <ProtectedRoute role="seller">
            <SellerUpload />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
