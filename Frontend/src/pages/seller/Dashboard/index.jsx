import { useEffect, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(data);
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="seller-layout">
      <header className="topbar">
        <button className="menu-btn">☰</button>
        <h3>Seller Dashboard</h3>
        <div className="avatar">S</div>
      </header>

      <main className="content">
        <h1>Welcome, Seller 👋</h1>
        <p className="subtitle">
          Manage your products and track your business
        </p>

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

        <div className="quick">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button
              className="primary"
              onClick={() => navigate("/seller/upload")}
            >
              Upload New Product
            </button>
            <button>View All Products</button>
          </div>
        </div>
      </main>
    </div>
  );
}
