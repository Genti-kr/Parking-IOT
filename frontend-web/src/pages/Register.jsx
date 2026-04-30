import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [navigate, user]);

  const updateField = (field) => (e) => {
    setForm((current) => ({ ...current, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phoneNumber = form.phoneNumber.trim();

    if (!fullName || !email || !form.password.trim()) {
      setError("Ploteso te gjitha fushat e detyrueshme.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password-i duhet te kete te pakten 6 karaktere.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password-et nuk perputhen.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      await register({
        fullName,
        email,
        phoneNumber: phoneNumber || null,
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
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
          value={form.fullName}
          onChange={updateField("fullName")}
          autoComplete="name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={updateField("email")}
          autoComplete="email"
          required
        />

        <label>Numri i telefonit</label>
        <input
          type="tel"
          value={form.phoneNumber}
          onChange={updateField("phoneNumber")}
          autoComplete="tel"
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={updateField("password")}
          autoComplete="new-password"
          required
        />

        <label>Konfirmo password-in</label>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={updateField("confirmPassword")}
          autoComplete="new-password"
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={busy}>
          {busy ? "Duke u regjistruar..." : "Regjistrohu"}
        </button>

        <p className="auth-switch">
          Ke llogari? <Link to="/login">Kyqu</Link>
        </p>
      </form>
    </div>
  );
}
