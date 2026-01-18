import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

export default function Register() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Semua field wajib diisi");
      return;
    }

    alert("Akun berhasil dibuat");
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleRegister}>
        <h2>Buat Akun</h2>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Pengguna</option>
          <option value="admin">Admin</option>
        </select>

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

        <button type="submit">Daftar</button>

        <div className="auth-links">
          <Link to="/">Kembali ke Login</Link>
        </div>
      </form>
    </div>
  );
}
