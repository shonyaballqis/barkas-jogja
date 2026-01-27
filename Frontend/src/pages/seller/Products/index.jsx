import { useEffect, useState } from "react";
import "../Dashboard/dashboard.css";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../api";

export default function SellerEditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stok, setStok] = useState("");
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
          setDescription(data.description || "");
          setPrice(data.price);
          setStok(data.stok);
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
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stok", stok);

    images.forEach((img) => {
      formData.append("image", img);
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
        navigate("/seller/dashboard");
      } else {
        alert("Gagal update produk");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="seller-layout">
      {/* TOPBAR */}
      <header className="topbar">
        <h3>Edit Product</h3>
        <div className="avatar">S</div>
      </header>

      <main className="content">
        <h1>Edit Product</h1>
        <p className="subtitle">Perbarui data produk</p>

        <div className="card" style={{ maxWidth: 600 }}>
          <form onSubmit={handleSubmit} className="form upload-form">
            <label>Nama Produk</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label>Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label>Stok</label>
            <input
              type="number"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
            />

            <label>Gambar Baru (opsional, max 5)</label>
            <input type="file" multiple onChange={handleImageChange} />

            <div className="actions">
              <button className="primary" type="submit">
                Update Produk
              </button>

              <button type="button" onClick={() => navigate(-1)}>
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
