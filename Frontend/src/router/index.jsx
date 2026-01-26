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

import ProtectedSeller from "./ProtectedSeller";

import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import SellerRequest from "../pages/Admin/SellerRequest";
import Users from "../pages/Admin/Users";
import Products from "../pages/Admin/Products";
import Transactions from "../pages/Admin/Transactions";
import Dashboard from "../pages/Admin/Dashboard";

/* ===== PROTECTOR LOGIN ===== */
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

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="seller-request" element={<SellerRequest />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}
