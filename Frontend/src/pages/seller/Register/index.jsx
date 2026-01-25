import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/auth.css";
import { API_URL } from "../../../api";

export default function SellerRegister() {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [ktpNumber, setKtpNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopName || !ktpNumber) {
      alert("Nama toko dan nomor KTP wajib diisi");
      return;
    }

    if (ktpNumber.length !== 16) {
      alert("Nomor KTP harus 16 digit");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu");
      navigate("/");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/seller/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          store_name: shopName,
          ktp_number: ktpNumber
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal mengirim pengajuan");
        return;
      }

      alert("Pengajuan seller berhasil dikirim, menunggu verifikasi admin");
      navigate("/seller/waiting");

    } catch (err) {
      alert("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
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

        <button type="submit" disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Pengajuan"}
        </button>

        <p style={{ fontSize: "12px", textAlign: "center" }}>
          Data akan diverifikasi oleh admin
        </p>
      </form>
    </div>
  );
}
