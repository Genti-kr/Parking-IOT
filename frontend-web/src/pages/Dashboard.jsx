import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Gabim ne ngarkim"));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="loading">Duke u ngarkuar...</div>;

  const cards = [
    { label: "Totali i vendeve", value: stats.totalSlots },
    { label: "Te lira", value: stats.freeSlots },
    { label: "Te zena", value: stats.occupiedSlots },
    { label: "Sesione aktive", value: stats.activeSessions },
    { label: "Te ardhurat sot", value: `${stats.revenueToday} EUR` },
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
