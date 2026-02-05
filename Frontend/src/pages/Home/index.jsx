import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Home/styles.css";

export default function Home() {
  const banners = [
    "/banner-1.jpg",
    "/banner-2.jpg",
    "/banner-3.jpg",
    "/banner-4.jpg",
    "/banner-5.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* ===== SECTION: HORIZONTAL HIGHLIGHT SLIDER ===== */}
      <section className="home-slider">
        <div className="slider-container">
          
          <div 
            className="slider-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((img, index) => (
            <div className="slider-card" key={index}>
              <img src={img} alt={`Highlight ${index + 1}`} />
              </div>
            ))}
          </div>

        {/* DOTS INDICATOR */}
        <div className="slider-dots">
          {banners.map((_, i) => (
            <span
              key={i}
              className={`dot ${currentSlide === i ? "active" : ""}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
          </div>
      </div>
    </section>

      {/* ===== SECTION: ETALASE PRODUK ===== */}
      <section className="home-products">
        <h2>Etalase Produk</h2>

        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div className="product-card" key={item}>
              <img
                src="https://via.placeholder.com/200"
                alt="Produk"
                className="product-image"
              />

              <div className="product-info">
                <h3 className="product-name">Nama Produk</h3>
                <p className="product-price">Rp 80.000</p>
                <p className="product-seller">Toko Barkas Jaya</p>
              </div>

              <button className="btn-add-cart">
                + Keranjang
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="home-footer">

        {/* === FOOTER CTA === */}
        <div className="footer-cta">
          <h2>Ingin Mempromosikan Barang Anda?</h2>
          <p>Daftarkan toko Anda dan mulai berjualan sekarang di Barang Bekas Jogja</p>

          <Link to="/seller/register">
            <button className="btn-cta">
              Daftar Jadi Seller
            </button>
          </Link>
        </div>

        {/* === FOOTER INFO === */}
        <div className="footer-info">

          {/* CONTACT US */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Email: support@barangbekasjogja.id</p>
            <p>WhatsApp: +62 812-3456-7890</p>
            <p>Alamat: Yogyakarta, Indonesia</p>
          </div>

          {/* BRAND / ABOUT */}
          <div className="footer-brand">
            <h3>Barang Bekas Jogja</h3>
            <p>
              Platform jual beli barang bekas terpercaya
              untuk mendukung gaya hidup berkelanjutan.
            </p>
          </div>

        </div>

        {/* === COPYRIGHT === */}
        <div className="footer-copy">
          <p>© 2026 Barang Bekas Jogja. All rights reserved.</p>
        </div>

      </footer>
    </div>
  );
}
