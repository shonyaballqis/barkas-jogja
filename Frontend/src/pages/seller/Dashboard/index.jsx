import { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../api";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const sellerName = user?.name || "Seller";

  // ===== FETCH PRODUCTS =====
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/seller`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error("Gagal ambil produk", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="seller-layout">
      {/* TOPBAR */}
      <header className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <h3>Seller Dashboard</h3>
        <div className="avatar">
          {sellerName.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h4>Menu</h4>
            <button onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          <ul>
            <li className="active">Dashboard</li>

            <li
              onClick={() => {
                navigate("/seller/upload");
                setSidebarOpen(false);
              }}
            >
              Upload Product
            </li>

            <li
              onClick={() => {
                navigate("/seller/products");
                setSidebarOpen(false);
              }}
            >
              My Products
            </li>

            <li onClick={handleLogout}>Logout</li>
          </ul>
        </aside>
      )}

      {/* CONTENT */}
      <main className="content">
        <h1>Welcome, {sellerName} 👋</h1>
        <p className="subtitle">
          Manage your products and track your business
        </p>

        {/* STATS */}
        <div className="stats">
          <div className="card">
            <p>Total Products</p>
            <h2>{products.length}</h2>
          </div>

          <div className="card">
            <p>Product Categories</p>
            <h2>{categories.length}</h2>
          </div>

          <div className="card">
            <p>Status</p>
            <h2 className="active">Active</h2>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick">
          <h3>Quick Actions</h3>

          <div className="actions">
            <button
              className="primary"
              onClick={() => navigate("/seller/upload")}
            >
              Upload New Product
            </button>

            <button onClick={() => navigate("/seller/products")}>
              View All Products
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}