import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function SellerRegister() {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [ktpNumber, setKtpNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!shopName || !ktpNumber) {
      alert("Nama toko dan nomor KTP wajib diisi");
      return;
    }

    if (ktpNumber.length !== 16) {
      alert("Nomor KTP harus 16 digit");
      return;
    }

    // SIMULASI SUBMIT SELLER
    localStorage.setItem("sellerStatus", "pending");

    alert("Pengajuan seller dikirim, menunggu verifikasi admin");

    navigate("/seller/waiting");
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
          type="text"
          placeholder="Nomor KTP (16 digit)"
          value={ktpNumber}
          maxLength={16}
          onChange={(e) =>
            setKtpNumber(e.target.value.replace(/\D/g, ""))
          }
        />

        <button type="submit">Kirim Pengajuan</button>

        <p style={{ fontSize: "12px", textAlign: "center" }}>
          Data akan diverifikasi oleh admin
        </p>
      </form>
    </div>
  );
}
