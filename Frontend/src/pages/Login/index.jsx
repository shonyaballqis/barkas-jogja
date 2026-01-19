import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // validasi
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setError("");

    // ===== LOGIN DUMMY + ROLE =====
    if (role === "admin") {
      localStorage.setItem("role", "admin");
      alert("Login sebagai Admin");
      navigate("/admin");
    } else {
      localStorage.setItem("role", "user");
      alert("Login sebagai Pengguna");
      navigate("/home");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleLogin}>
        <img src="/logo.jpeg" alt="Logo" />

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

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>

        <div className="auth-links">
          <Link to="/register">Buat Akun</Link>
          <Link to="/reset-password">Lupa Password?</Link>
        </div>
      </form>
    </div>
  );
}
