import { useState } from "react";
import "../../styles/auth.css";

export default function SellerUpload() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      alert("Semua field wajib diisi");
      return;
    }

    // SIMULASI SIMPAN PRODUK
    const newProduct = {
      id: Date.now(),
      name,
      price,
      category,
      image: URL.createObjectURL(image),
    };

    const products = JSON.parse(localStorage.getItem("products")) || [];
    localStorage.setItem("products", JSON.stringify([...products, newProduct]));

    alert("Produk berhasil diupload");

    // reset
    setName("");
    setPrice("");
    setCategory("");
    setImage(null);
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Upload Produk</h2>

        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Harga (contoh: Rp 50.000)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Pilih Kategori</option>
          <option value="Pakaian">Pakaian</option>
          <option value="Elektronik">Elektronik</option>
          <option value="Sepatu">Sepatu</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit">Upload Produk</button>
      </form>
    </div>
  );
}
