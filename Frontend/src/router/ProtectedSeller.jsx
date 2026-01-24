import { Navigate } from "react-router-dom";

export default function ProtectedSeller({ children }) {
  const role = localStorage.getItem("role");
  const status = localStorage.getItem("sellerStatus");

  if (!role) {
    return <Navigate to="/" replace />;
  }

  if (role !== "seller") {
    return <Navigate to="/home" replace />;
  }

  if (status !== "approved") {
    return <Navigate to="/seller/waiting" replace />;
  }

  return children;
}

