<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState } from "react";
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
<<<<<<< HEAD
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
=======
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setBusy(true);
    try {
      await register({ fullName, email, password, phoneNumber });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
    } finally {
      setBusy(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="auth-page">
      <div className="auth-bg-glow auth-bg-glow-1" />
      <div className="auth-bg-glow auth-bg-glow-2" />

      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p className="subtitle">Sign up to access Smart Parking</p>

        <label>Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
          required
        />

        <label>Email</label>
        <input
          type="email"
<<<<<<< HEAD
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
=======
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Phone number (optional)</label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
        />

        <label>Password</label>
        <input
          type="password"
<<<<<<< HEAD
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
=======
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <label>Confirm password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={6}
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
          required
        />

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={busy}>
<<<<<<< HEAD
          {busy ? "Duke u regjistruar..." : "Regjistrohu"}
        </button>

        <p className="auth-switch">
          Ke llogari? <Link to="/login">Kyqu</Link>
=======
          {busy ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
>>>>>>> c6b1066723ca95b0fe093273ea7321929b18a9d1
        </p>
      </form>
    </div>
  );
}
