import { useState } from "react";
import "../Dashboard/dashboard.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../api";

export default function SellerUpload() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maksimal 5 gambar");
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !stock || !description || images.length === 0) {
      alert("Semua field wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price",Number (price));
    formData.append("stock",Number (stock));
    formData.append("description", description);

   images.forEach(img => {
    formData.append("images", img); // 🔥 SAMA DENGAN BACKEND
  });

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Produk berhasil ditambahkan");
        navigate("/seller/dashboard");
      } else {
        alert("Gagal upload produk");
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
        <h3>Upload Product</h3>
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
            <li className="active">Upload Product</li>
            <li onClick={() => navigate("/seller/products")}>
              My Products
            </li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </aside>
      )}

      {/* CONTENT */}
      <main className="content">
        <h1>Upload New Product</h1>
        <p className="subtitle">Tambahkan produk baru ke tokomu</p>

        <div className="upload-card">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-grid">
              <div>
                <label>Nama Produk</label>
                <input
                  type="text"
                  placeholder="Masukkan nama produk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label>Harga</label>
                <input
                  type="number"
                  placeholder="Masukkan harga"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div>
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Jumlah stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            <label className="mt">Deskripsi Produk</label>
            <textarea
              placeholder="Tuliskan deskripsi produk"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="mt">Gambar Produk (max 5)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* PREVIEW IMAGE */}
            {images.length > 0 && (
              <div className="image-preview">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                  />
                ))}
              </div>
            )}

            <div className="actions">
              <button type="submit" className="primary">
                Simpan Produk
              </button>

              <button
                type="button"
                onClick={() => navigate("/seller/dashboard")}
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
