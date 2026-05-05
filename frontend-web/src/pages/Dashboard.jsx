import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../services/mockData.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [source, setSource] = useState("api");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchDashboardStats();
      setStats(res.data);
      setSource(res.source);
    } catch {
      setError("Gabim ne ngarkim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <div className="loading">Duke u ngarkuar...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="loading">Nuk ka te dhena.</div>;

  const occupancyRate =
    stats.totalSlots > 0 ? Math.round((stats.occupiedSlots / stats.totalSlots) * 100) : 0;
  const availabilityRate =
    stats.totalSlots > 0 ? Math.round((stats.freeSlots / stats.totalSlots) * 100) : 0;

  const cards = [
    {
      label: "Totali i vendeve",
      value: stats.totalSlots,
      accent: "blue",
    },
    {
      label: "Te lira",
      value: stats.freeSlots,
      accent: "green",
    },
    {
      label: "Te zena",
      value: stats.occupiedSlots,
      accent: "amber",
    },
    {
      label: "Sesione aktive",
      value: stats.activeSessions,
      accent: "purple",
    },
    {
      label: "Te ardhurat sot",
      value: `${Number(stats.revenueToday || 0).toFixed(2)} EUR`,
      accent: "slate",
    },
  ];

  const insights = [
    { label: "Shfrytezimi", value: `${occupancyRate}%` },
    { label: "Disponueshmeria", value: `${availabilityRate}%` },
    { label: "Burimi i te dhenave", value: source === "mock" ? "Mock Data" : "API Live" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-head">
        <div>
          <h2>Dashboard</h2>
          <p className="dashboard-subtitle">Pamje e pergjithshme e parkingut ne kohe reale.</p>
        </div>
        <button className="dashboard-refresh-btn" type="button" onClick={loadDashboard}>
          Rifresko
        </button>
      </div>

      {source === "mock" && (
        <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>
      )}

      <div className="stats-grid">
        {cards.map((c) => (
          <article className={`stat-card stat-card-${c.accent}`} key={c.label}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </article>
        ))}
      </div>

      <div className="dashboard-insights">
        {insights.map((item) => (
          <div className="dashboard-insight-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
