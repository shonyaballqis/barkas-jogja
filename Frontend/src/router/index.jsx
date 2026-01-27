import { Routes, Route, Navigate } from "react-router-dom";

/* AUTH & USER */
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";

/* SELLER */
import SellerRegister from "../pages/seller/Register";
import SellerWaiting from "../pages/seller/Waiting";
import SellerDashboard from "../pages/seller/Dashboard";
import SellerUpload from "../pages/seller/Upload";
import SellerProducts from "../pages/seller/Products";

/* ADMIN */
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import SellerRequest from "../pages/Admin/SellerRequest";
import Users from "../pages/Admin/Users";
import Products from "../pages/Admin/Products";
import Transactions from "../pages/Admin/Transactions";

/* PROTECTOR */
import ProtectedSeller from "./ProtectedSeller";

/* ===== PROTECTOR LOGIN ===== */
function ProtectedRoute({ children }) {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/" replace />;
  return children;
}

export default function Router() {
  return (
    <Routes>
      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ===== USER ===== */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* ===== SELLER ===== */}
      <Route
        path="/seller/register"
        element={
          <ProtectedRoute>
            <SellerRegister />
          </ProtectedRoute>
        }
      />

      <Route
        path="/seller/waiting"
        element={
          <ProtectedRoute>
            <SellerWaiting />
          </ProtectedRoute>
        }
      />

      <Route
        path="/seller/dashboard"
        element={
          <ProtectedSeller>
            <SellerDashboard />
          </ProtectedSeller>
        }
      />

      <Route
        path="/seller/upload"
        element={
          <ProtectedSeller>
            <SellerUpload />
          </ProtectedSeller>
        }
      />

      <Route
        path="/seller/products"
        element={
          <ProtectedSeller>
            <SellerProducts />
          </ProtectedSeller>
        }
      />

      {/* ===== ADMIN ===== */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="seller-request" element={<SellerRequest />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>
    </Routes>
  );
}
