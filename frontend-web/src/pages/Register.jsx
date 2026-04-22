import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await register({ fullName, email, password, phoneNumber });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Regjistrimi deshtoi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Krijo llogari</h2>
        <p className="subtitle">Regjistrohu per te perdorur Smart Parking</p>

        <label>Emri i plote</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Emri Mbiemri"
          autoComplete="name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 6 karaktere"
          autoComplete="new-password"
          minLength={6}
          required
        />

        <label>Numri i telefonit (opsionale)</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+383 44 123 456"
          autoComplete="tel"
        />

        {error && (
          <div className="state-banner state-error" role="alert">
            {error}
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Duke u regjistruar..." : "Regjistrohu"}
        </button>

        <p className="auth-switch">
          Ke llogari? <Link to="/login">Kyqu ketu</Link>
        </p>
      </form>
    </div>
  );
}
