import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    setError("");
    setLoading(true);
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Gabim ne ngarkim"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (error) {
    return (
      <div className="state-card">
        <div className="state-banner state-error">{error}</div>
        <button className="btn btn-primary" onClick={loadStats}>
          Provo perseri
        </button>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="state-card">
        <div className="spinner" aria-hidden="true" />
        <p>Duke u ngarkuar te dhenat e dashboard-it...</p>
      </div>
    );
  }

  const cards = [
    { label: "Totali i vendeve", value: stats.totalSlots },
    { label: "Te lira", value: stats.freeSlots },
    { label: "Te zena", value: stats.occupiedSlots },
    { label: "Sesione aktive", value: stats.activeSessions },
    { label: "Te ardhurat sot", value: `${stats.revenueToday} EUR` },
  ];

  return (
    <section>
      <div className="section-head">
        <h3 className="section-title">Dashboard</h3>
        <button className="btn btn-secondary" onClick={loadStats}>
          Rifresko
        </button>
      </div>
      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
