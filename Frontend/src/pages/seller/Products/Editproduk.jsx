import { useEffect, useState } from "react";
import "../Dashboard/dashboard.css";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../api";

export default function SellerEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  // ===== GET DETAIL PRODUK =====
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setName(data.name);
          setPrice(data.price);
          setStock(data.stock || data.stok);
          setDescription(data.description || "");
        }
      } catch (err) {
        console.error("Gagal ambil detail produk", err);
      }
    };

    fetchDetail();
  }, [id]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maksimal 5 gambar");
      return;
    }
    setImages(files);
  };

  // ===== UPDATE PRODUCT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    formData.append("description", description);

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Produk berhasil diupdate");
        navigate("/seller/products");
      } else {
        alert("Gagal update produk");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
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
        <h3>Edit Product</h3>
        <div className="avatar">S</div>
      </header>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <h4>Seller Menu</h4>
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
        <h1>Edit Product</h1>
        <p className="subtitle">Perbarui data produk</p>

        <div className="upload-card">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-grid">
              <div>
                <label>Nama Produk</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label>Harga</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label>Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            <label className="mt">Deskripsi Produk</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="mt">Gambar Baru (opsional, max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            <div className="actions">
              <button type="submit" className="primary">
                Update Produk
              </button>

              <button
                type="button"
                onClick={() => navigate("/seller/products")}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
