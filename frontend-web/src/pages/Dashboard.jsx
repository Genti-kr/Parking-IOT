import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchDashboardStats,
  fetchParkingSlots,
  fetchReservations,
} from "../services/mockData.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [source, setSource] = useState("api");
  const role = user?.role || "Guest";
  const isPrivileged = role === "Admin" || role === "Operator";

  useEffect(() => {
    const load = isPrivileged
      ? fetchDashboardStats().then((res) => ({
          data: res.data,
          source: res.source,
        }))
      : Promise.all([fetchParkingSlots(), fetchReservations()]).then(
          ([slotsRes, reservationsRes]) => {
            const reservations = reservationsRes.data || [];

            return {
              data: {
                availableSlots: (slotsRes.data || []).length,
                myReservations: reservations.length,
                activeReservations: reservations.filter(
                  (r) => (r.status || "").toLowerCase() === "confirmed"
                ).length,
              },
              source:
                slotsRes.source === "mock" || reservationsRes.source === "mock"
                  ? "mock"
                  : "api",
            };
          }
        );

    load
      .then((res) => {
        setStats(res.data);
        setSource(res.source);
        setError("");
      })
      .catch(() => setError("Gabim ne ngarkim"));
  }, [isPrivileged]);

  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="loading">Duke u ngarkuar...</div>;

  const cards = isPrivileged
    ? [
        { label: "Totali i vendeve", value: stats.totalSlots },
        { label: "Te lira", value: stats.freeSlots },
        { label: "Te zena", value: stats.occupiedSlots },
        { label: "Sesione aktive", value: stats.activeSessions },
        { label: "Te ardhurat sot", value: `${stats.revenueToday} EUR` },
      ]
    : [
        { label: "Vende te lira", value: stats.availableSlots },
        { label: "Rezervimet e mia", value: stats.myReservations },
        { label: "Rezervime aktive", value: stats.activeReservations },
        { label: "Roli im", value: role },
      ];

  return (
    <div>
      <h2>{isPrivileged ? "Dashboard Admin" : "Dashboard i Perdoruesit"}</h2>
      <p className="page-subtitle">
        {isPrivileged
          ? "Pamje administrative me statistika dhe monitorim te sistemit."
          : "Pamje personale me rezervimet dhe disponueshmerine aktuale te parkimit."}
      </p>
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
