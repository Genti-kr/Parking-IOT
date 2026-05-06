<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState } from "react";
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
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
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Smart Parking</h2>
        <p className="subtitle">Log in to the administration panel</p>

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

<<<<<<< HEAD
        <button type="submit" disabled={busy}>
          {busy ? "Duke u kyqur..." : "Kyqu"}
        </button>

        <p className="auth-switch">
          Nuk ke llogari? <Link to="/register">Regjistrohu</Link>
=======
        <button type="submit" disabled={busy}>{busy ? "Signing in..." : "Log in"}</button>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
        </p>
      </form>
    </div>
  );
}