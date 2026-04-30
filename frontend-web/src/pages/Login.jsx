import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      setError("Ploteso email-in dhe password-in.");
      return;
    }

    setError("");
    setBusy(true);
    try {
      await login(normalizedEmail, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login i pasakte");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Smart Parking</h2>
        <p className="subtitle">Kyqu ne panelin e administrimit</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={busy}>
          {busy ? "Duke u kyqur..." : "Kyqu"}
        </button>

        <p className="auth-switch">
          Nuk ke llogari? <Link to="/register">Regjistrohu</Link>
        </p>
      </form>
    </div>
  );
}
