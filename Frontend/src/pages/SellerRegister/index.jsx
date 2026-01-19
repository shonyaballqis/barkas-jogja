import { useState } from "react";
import "../../styles/auth.css";

export default function SellerRegister() {
  const [shopName, setShopName] = useState("");
  const [ktp, setKtp] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!shopName || !ktp) {
      alert("Nama toko dan KTP wajib diisi");
      return;
    }

    // SIMULASI SUBMIT
    alert("Pengajuan seller dikirim, menunggu verifikasi admin");
    localStorage.setItem("role", "seller");

    // status pending (dummy)
    localStorage.setItem("sellerStatus", "pending");
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Daftar Jadi Seller</h2>

        <input
          type="text"
          placeholder="Nama Toko"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setKtp(e.target.files[0])}
        />

        <button type="submit">Kirim Pengajuan</button>

        <p style={{ fontSize: "12px", textAlign: "center" }}>
          Data akan diverifikasi oleh admin
        </p>
      </form>
    </div>
  );
}
