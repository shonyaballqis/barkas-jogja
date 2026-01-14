import "./login.css";

export default function Login() {
  return (
    <main className="login">
      <div className="login-box">
        <img src="/logo.png" alt="Barkas Jogja" className="logo" />

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button>Login</button>
      </div>
    </main>
  );
}
