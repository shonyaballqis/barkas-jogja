import { Navigate } from "react-router-dom";

export default function ProtectedSeller({ children }) {
  const role = localStorage.getItem("role");
  const status = localStorage.getItem("sellerStatus");

  // bukan seller
  if (role !== "seller") {
    return <Navigate to="/home" replace />;
  }

  // seller belum di-approve
  if (status !== "approved") {
    return <Navigate to="/seller/waiting" replace />;
  }

  return children;
}
