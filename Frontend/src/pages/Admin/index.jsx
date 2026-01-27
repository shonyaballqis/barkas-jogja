import { Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import SellerRequest from "./SellerRequest";

export default function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="seller-request" element={<SellerRequest />} />
      </Routes>
    </AdminLayout>
  );
}
