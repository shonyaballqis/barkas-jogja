import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* KIRI */}
      <div className="nav-left">
        <img src="/logo.jpeg" alt="Logo" className="nav-logo" />
        <span className="nav-title">Barang Bekas Jogja</span>
      </div>

    

      {/* KANAN */}
      <div className="nav-right">
        <Link to="/home">🏠</Link>
        <Link to="/cart">🛒</Link>
        <Link to="/">👤</Link>
      </div>
    </nav>
  );
}
