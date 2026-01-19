import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Email wajib diisi");
      return;
    }

    alert("Link reset password dikirim");
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={handleReset}>
        <h2>Reset Password</h2>

        <input
          type="email"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Kirim</button>

        <div className="auth-links">
          <Link to="/">Kembali ke Login</Link>
        </div>
      </form>
    </div>
  );
}
