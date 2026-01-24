import { useEffect, useState } from "react";
import "./dashboard.css";

export default function SellerUpload() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(saved);
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="seller-layout">
      {/* TOPBAR */}
      <header className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <h3>Seller Dashboard</h3>
        <div className="avatar">S</div>
      </header>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h4>Menu</h4>
            <button onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          <ul>
            <li className="active">📊 Dashboard</li>
            <li>⬆ Upload Product</li>
            <li>📦 My Products</li>
            <li onClick={handleLogout}>🚪 Logout</li>
          </ul>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main className="content">
        <h1>Welcome, Seller 👋</h1>
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

        {/* QUICK ACTION */}
        <div className="quick">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button className="primary">Upload New Product</button>
            <button>View All Products</button>
          </div>
        </div>
      </main>
    </div>
  );
}
