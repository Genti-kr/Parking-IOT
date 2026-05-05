import { useEffect, useState } from "react";
import api from "../services/api.js";
import { fetchReservations } from "../services/mockData.js";

export default function Reservations() {
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

  const loadReservations = async () => {
    try {
      const res = await fetchReservations();
      setReservations(res.data);
      setSource(res.source);
    } catch {
      setError("Gabim ne ngarkim te rezervimeve.");
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

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
    <section>
      <h2>Reservations</h2>
      {source === "mock" && (
        <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>
      )}
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
                  </span>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && !error && (
              <tr>
                <td colSpan={7}>Nuk ka rezervime per momentin.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
    </section>
  );
}
