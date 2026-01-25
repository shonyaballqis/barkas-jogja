import { Navigate } from "react-router-dom";

export default function ProtectedSeller({ children }) {
  const role = localStorage.getItem("role");
  const sellerStatus = localStorage.getItem("sellerStatus");

  // belum login
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // bukan seller
  if (role !== "seller") {
    return <Navigate to="/home" replace />;
  }

  // seller TAPI status masih nunggu
  if (sellerStatus === "pending") {
    return <Navigate to="/seller/waiting" replace />;
  }

  // 🔥 sellerStatus = none / approved / verified
  return children;
}
