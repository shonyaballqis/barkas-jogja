import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import Admin from "../pages/Admin";

import SellerRegister from "../pages/seller/Register";
import SellerWaiting from "../pages/seller/Waiting";
import SellerDashboard from "../pages/seller/Dashboard";
import SellerUpload from "../pages/seller/Upload";
import SellerProducts from "../pages/seller/Products"; 

import ProtectedSeller from "./ProtectedSeller";

/* PROTECTOR LOGIN */
function ProtectedRoute({ children }) {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/" replace />;
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

      {/* SELLER REGISTER */}
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
            <SellerDashboard />
          </ProtectedSeller>
        }
      />

      {/* SELLER UPLOAD */}
      <Route
        path="/seller/upload"
        element={
          <ProtectedSeller>
            <SellerUpload />
          </ProtectedSeller>
        }
      />

      {/* SELLER PRODUCTS */}
      <Route
        path="/seller/products"
        element={
          <ProtectedSeller>
            <SellerProducts />
          </ProtectedSeller>
        }
      />

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={<Admin />} />
    </Routes>
  );
}
