<<<<<<< HEAD
import { useEffect, useState } from "react";
import { fetchReservations } from "../services/mockData.js";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [source, setSource] = useState("api");

  useEffect(() => {
    fetchReservations()
      .then((res) => {
        setReservations(res.data);
        setSource(res.source);
      })
      .catch(() => setError("Gabim ne ngarkim te rezervimeve"));
  }, []);

  return (
    <div>
      <h2>Reservations</h2>
      {source === "mock" && (
        <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>
      )}
=======
import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import { fetchReservations } from "../services/mockData.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Reservations() {
  const { user } = useAuth();
  const isAdmin = (user?.role || "").toLowerCase() === "admin";
  const [entryForm, setEntryForm] = useState({
    slotId: "",
    plateNumber: "",
    userId: "",
  });
  const [exitForm, setExitForm] = useState({
    sessionId: "",
  });
  const [loadingEntry, setLoadingEntry] = useState(false);
  const [loadingExit, setLoadingExit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reservations, setReservations] = useState([]);
  const [source, setSource] = useState("api");
  const [activeStatusTab, setActiveStatusTab] = useState("all");

  const reservationTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const loadReservations = async () => {
    setError("");
    try {
      const res = await fetchReservations();

      const rows = Array.isArray(res.data) ? res.data : [];
      const onlyMyData = rows.filter((r) => {
        if (isAdmin) return true;
        return r.userId === user?.userId;
      });

      // For regular users, never expose mock demo data from other people.
      if (!isAdmin && res.source === "mock") {
        setReservations([]);
        setSource("api");
        return;
      }

      setReservations(onlyMyData);
      setSource(res.source);
    } catch {
      setError("Gabim ne ngarkim te rezervimeve.");
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const tabCounts = useMemo(() => {
    const counts = {
      all: reservations.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    reservations.forEach((r) => {
      const key = (r.status || "").toLowerCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });

    return counts;
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    if (activeStatusTab === "all") return reservations;
    return reservations.filter((r) => (r.status || "").toLowerCase() === activeStatusTab);
  }, [reservations, activeStatusTab]);

  const onEntryChange = (e) => {
    const { name, value } = e.target;
    setEntryForm((prev) => ({ ...prev, [name]: value }));
  };

  const onExitChange = (e) => {
    const { name, value } = e.target;
    setExitForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEntry = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!entryForm.slotId) {
      setError("Slot ID eshte i detyrueshem.");
      return;
    }

    try {
      setLoadingEntry(true);
      const payload = {
        slotId: Number(entryForm.slotId),
        plateNumber: entryForm.plateNumber || null,
        userId: entryForm.userId ? Number(entryForm.userId) : null,
      };
      const { data } = await api.post("/entry", payload);
      setSuccess(`Entry u krijua me sukses. Session ID: ${data.sessionId}`);
      setEntryForm({ slotId: "", plateNumber: "", userId: "" });
      loadReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Gabim gjate krijimit te entry.");
    } finally {
      setLoadingEntry(false);
    }
  };

  const submitExit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!exitForm.sessionId) {
      setError("Session ID eshte i detyrueshem.");
      return;
    }

    try {
      setLoadingExit(true);
      const payload = { sessionId: Number(exitForm.sessionId) };
      await api.post("/exit", payload);
      setSuccess("Exit u krye me sukses.");
      setExitForm({ sessionId: "" });
      loadReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Gabim gjate daljes (exit).");
    } finally {
      setLoadingExit(false);
    }
  };

  return (
    <section className="reservations-page">
      <div className="reservations-header">
        <h2>Reservations</h2>
        <p>Track reservation status and manage entries in one place.</p>
      </div>
      {isAdmin && source === "mock" && (
        <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>
      )}
      {!isAdmin && (
        <p className="info-banner">Po shfaqen vetem rezervimet e llogarise tende.</p>
      )}
      <div className="reservation-toolbar">
        <div className="reserve-mode-tabs reservations-status-tabs">
          {reservationTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeStatusTab === tab.key ? "active" : ""}
              onClick={() => setActiveStatusTab(tab.key)}
            >
              {tab.label} <span className="tab-count">{tabCounts[tab.key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
      {error && <div className="error">{error}</div>}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Perdoruesi</th>
              <th>Targa</th>
              <th>Vendi</th>
              <th>Fillimi</th>
              <th>Mbarimi</th>
              <th>Statusi</th>
            </tr>
          </thead>
          <tbody>
<<<<<<< HEAD
            {reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.fullName}</td>
                <td>{r.plateNumber}</td>
                <td>{r.slotNumber}</td>
                <td>{r.startTime}</td>
                <td>{r.endTime}</td>
                <td>
                  <span className={`badge badge-${r.status.toLowerCase()}`}>
                    {r.status}
=======
            {filteredReservations.map((r) => (
              <tr key={r.id ?? r.reservationId}>
                <td>{r.id ?? r.reservationId}</td>
                <td>{isAdmin ? (r.fullName || `User #${r.userId ?? "-"}`) : "You"}</td>
                <td>{r.plateNumber}</td>
                <td>{r.slotNumber || `Slot #${r.slotId ?? "-"}`}</td>
                <td>{r.startTime ? new Date(r.startTime).toLocaleString() : "-"}</td>
                <td>{r.endTime ? new Date(r.endTime).toLocaleString() : "-"}</td>
                <td>
                  <span className={`badge badge-${(r.status || "pending").toLowerCase()}`}>
                    {r.status || "Pending"}
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
                  </span>
                </td>
              </tr>
            ))}
<<<<<<< HEAD
            {reservations.length === 0 && !error && (
=======
            {filteredReservations.length === 0 && !error && (
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
              <tr>
                <td colSpan={7}>Nuk ka rezervime per momentin.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
<<<<<<< HEAD
    </div>
=======
      {isAdmin && (
        <>
          <div className="reservations-note state-banner state-info">
            Perdore <strong>New Entry</strong> per hyrje te vetures dhe{" "}
            <strong>Exit Session</strong> per daljen.
          </div>
          {error && <div className="reservations-banner state-banner state-error">{error}</div>}
          {success && <div className="reservations-banner state-banner state-info">{success}</div>}

          <div className="reservations-grid">
            <div className="state-card reservation-card">
              <h4>New Entry</h4>
              <form className="reservation-form" onSubmit={submitEntry}>
                <label htmlFor="slotId">Slot ID</label>
                <input
                  id="slotId"
                  name="slotId"
                  type="number"
                  min="1"
                  value={entryForm.slotId}
                  onChange={onEntryChange}
                  placeholder="p.sh 1"
                  required
                />

                <label htmlFor="plateNumber">Plate Number (opsionale)</label>
                <input
                  id="plateNumber"
                  name="plateNumber"
                  type="text"
                  value={entryForm.plateNumber}
                  onChange={onEntryChange}
                  placeholder="p.sh 06-123-AB"
                />

                <label htmlFor="userId">User ID (opsionale)</label>
                <input
                  id="userId"
                  name="userId"
                  type="number"
                  min="1"
                  value={entryForm.userId}
                  onChange={onEntryChange}
                  placeholder="p.sh 2"
                />

                <button className="btn btn-primary" type="submit" disabled={loadingEntry}>
                  {loadingEntry ? "Duke ruajtur..." : "Krijo Entry"}
                </button>
              </form>
            </div>

            <div className="state-card reservation-card">
              <h4>Exit Session</h4>
              <form className="reservation-form" onSubmit={submitExit}>
                <label htmlFor="sessionId">Session ID</label>
                <input
                  id="sessionId"
                  name="sessionId"
                  type="number"
                  min="1"
                  value={exitForm.sessionId}
                  onChange={onExitChange}
                  placeholder="p.sh 15"
                  required
                />

                <button className="btn btn-secondary" type="submit" disabled={loadingExit}>
                  {loadingExit ? "Duke procesuar..." : "Bej Exit"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </section>
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
  );
}
