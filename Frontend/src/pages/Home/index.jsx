import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

const PRODUCTS = [
  { id: 1, name: "Galon", price: "Rp 20.000", category: "Elektronik", img: "https://via.placeholder.com/150" },
  { id: 2, name: "Kemeja 5pcs", price: "Rp 125.000", category: "Pakaian", img: "https://via.placeholder.com/150" },
  { id: 3, name: "Sepatu", price: "Rp 100.000", category: "Sepatu", img: "https://via.placeholder.com/150" },
  { id: 4, name: "Tas", price: "Rp 80.000", category: "Pakaian", img: "https://via.placeholder.com/150" },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <main className="home">
      {/* SEARCH */}
      <input
        className="search"
        placeholder="Cari barang..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* KATEGORI */}
      <div className="category">
        {["All", "Pakaian", "Elektronik", "Sepatu"].map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUK */}
      <section className="grid">
        {filteredProducts.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.img} alt={item.name} />
            <h4>{item.name}</h4>
            <p>{item.price}</p>
            <button className="cart">+ Keranjang</button>
          </div>
        ))}
      </section>

      {/* MULAI JUAL (SELLER FLOW) */}
      <div className="promo">
        <Link to="/seller/register" className="promo-btn">
          Ingin Promosikan Barang Anda?
        </Link>
      </div>
    </main>
  );
}
