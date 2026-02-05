import { useEffect, useState } from "react";
import "../Dashboard/dashboard.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../api";

export default function SellerProducts() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const sellerName = user?.name || "Seller";

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

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus produk ini?")) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchProducts();
      } else {
        alert("Gagal hapus produk");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        <h3>My Products</h3>
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
            <li onClick={() => navigate("/seller/dashboard")}>
              Dashboard
            </li>
            <li onClick={() => navigate("/seller/upload")}>
              Upload Product
            </li>
            <li className="active">My Products</li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </aside>
      )}

      {/* CONTENT */}
      <main className="content">
        <h1>My Products</h1>
        <p className="subtitle">Daftar produk yang kamu jual</p>

        <div className="product-grid">
          {products.length === 0 ? (
            <p>Belum ada produk</p>
          ) : (
            products.map((p) => (
              <div className="product-card" key={p.product_id}>
                <img
                  src={
                    p.image_url
                      ? `${API_URL}${p.image_url}`
                      : "/no-image.png"
                  }
                  alt={p.name}
                  className="product-image"
                />

                <h4>{p.name}</h4>
                <p className="price">Rp {p.price}</p>

                <div className="actions">
                  <button
                    onClick={() =>
                      navigate(`/seller/products/edit/${p.product_id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={() => handleDelete(p.product_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
