import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Admin Panel</h2>

      <nav>
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/seller-request">Permintaan Seller</NavLink>
        <NavLink to="/admin/users">Pengguna</NavLink>
        <NavLink to="/admin/products">Produk</NavLink>
        <NavLink to="/admin/transactions">Transaksi</NavLink>
      </nav>
    </aside>
  );
}
