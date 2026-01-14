import { Link } from "react-router-dom"
import "../styles/navbar.css"

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand">
          <img src="/logo.png" alt="Barkas Jogja" />
          <span>Barkas Jogja</span>
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/category">Category</Link>
        </nav>
      </div>
    </header>
  )
}
