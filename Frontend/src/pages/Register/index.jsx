import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Semua field wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registrasi gagal");
        return;
      }

      alert("Registrasi berhasil, silakan cek email untuk verifikasi");
      navigate("/");

    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleRegister}>
        <h2>Buat Akun</h2>

        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Daftar"}
        </button>

        <div className="auth-links">
          <Link to="/">Kembali ke Login</Link>
        </div>
      </form>
    </div>
  );
}
