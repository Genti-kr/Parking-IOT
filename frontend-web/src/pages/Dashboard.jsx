import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../services/mockData.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [source, setSource] = useState("api");

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => {
        setStats(res.data);
        setSource(res.source);
      })
      .catch(() => setError("Gabim ne ngarkim"));
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
      {source === "mock" && (
        <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>
      )}
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
