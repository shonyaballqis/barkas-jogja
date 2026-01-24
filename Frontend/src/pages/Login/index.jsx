import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setError("");
    setLoading(true);

    /**
     * =========================
     * DUMMY LOGIN (FRONTEND)
     * =========================
     */
    const dummyAccounts = [
      {
        email: "admin@barkas.com",
        password: "admin123",
        role: "admin"
      },
      {
        email: "seller@barkas.com",
        password: "seller123",
        role: "seller"
      },
      {
        email: "user@barkas.com",
        password: "user123",
        role: "buyer"
      }
    ];

    const dummyUser = dummyAccounts.find(
      (u) => u.email === email && u.password === password
    );

    if (dummyUser) {
      // SIMPAN AUTH DUMMY
      localStorage.setItem("token", "dummy-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ email: dummyUser.email, role: dummyUser.role })
      );
      localStorage.setItem("role", dummyUser.role);

      // REDIRECT SESUAI ROLE
      if (dummyUser.role === "admin") {
        navigate("/admin");
      } else if (dummyUser.role === "seller") {
        navigate("/seller/upload");
      } else {
        navigate("/home");
      }

      setLoading(false);
      return;
    }

    /**
     * =========================
     * LOGIN KE BACKEND (ASLI)
     * =========================
     */
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "seller") {
        navigate("/seller/upload");
      } else {
        navigate("/home");
      }

    } catch (err) {
      setError("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleLogin}>
        <img src="/logo.jpeg" alt="Logo" />

        <h2>Login</h2>

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
          {loading ? "Loading..." : "Login"}
        </button>

        <div className="auth-links">
          <Link to="/register">Buat Akun</Link>
          <Link to="/reset-password">Lupa Password?</Link>
        </div>
      </form>
    </div>
  );
}
