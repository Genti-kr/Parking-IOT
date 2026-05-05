import { useEffect, useState } from "react";
<<<<<<< HEAD
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
=======
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { fetchDashboardStats, fetchParkingSlots } from "../services/mockData.js";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [slots, setSlots] = useState([]);
  const [latestReservations, setLatestReservations] = useState([]);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [error, setError] = useState("");
  const [source, setSource] = useState("api");
  const [loading, setLoading] = useState(true);
  const [availableDetailedSlots, setAvailableDetailedSlots] = useState([]);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserveLoading, setReserveLoading] = useState(false);
  const [reserveSuccess, setReserveSuccess] = useState("");
  const [reserveError, setReserveError] = useState("");
  const [latestStatusTab, setLatestStatusTab] = useState("all");
  const [reserveMode, setReserveMode] = useState("duration");
  const [reserveForm, setReserveForm] = useState({
    slotId: "",
    plateNumber: "",
    startDate: "",
    startTime: "",
    durationHours: 2,
    endDate: "",
    endTime: "",
  });
  const userRole = (user?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";
  const activeVehicleStorageKey = user?.userId ? `activeVehicleId:${user.userId}` : "activeVehicleId";

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const slotsResponse = await fetchParkingSlots();
      const allSlots = Array.isArray(slotsResponse.data) ? slotsResponse.data : [];
      setSlots(allSlots);

      try {
        const { data } = await api.get("/parking/available-detailed");
        const detailed = Array.isArray(data) ? data : [];
        setAvailableDetailedSlots(detailed);
      } catch {
        const fallbackDetailed = allSlots
          .filter((s) => (s.status || "").toLowerCase() === "free")
          .map((s) => ({
            slotId: s.slotId,
            slotNumber: s.slotNumber,
            zoneId: s.zoneId ?? 0,
            zoneName: `Zone ${s.zoneId ?? "N/A"}`,
            hourlyRate: 1,
            status: "Free",
          }));
        setAvailableDetailedSlots(fallbackDetailed);
      }

      if (!isAdmin) {
        const { data: reservationsData } = await api.get("/reservations");
        const { data: vehiclesData } = await api.get("/vehicles");
        const vehicles = Array.isArray(vehiclesData) ? vehiclesData : [];
        const reservations = Array.isArray(reservationsData) ? reservationsData : [];
        const myReservations = reservations.filter((r) => r.userId === user?.userId);
        const storedActiveVehicleId = Number(localStorage.getItem(activeVehicleStorageKey));
        const selectedVehicle =
          vehicles.find((v) => v.vehicleId === storedActiveVehicleId) ||
          vehicles[0] ||
          null;
        setActiveVehicle(selectedVehicle);
        if (selectedVehicle?.vehicleId) {
          localStorage.setItem(activeVehicleStorageKey, String(selectedVehicle.vehicleId));
        } else {
          localStorage.removeItem(activeVehicleStorageKey);
        }
        setLatestReservations([]);
        const totalSlots = allSlots.length;
        const freeSlots = allSlots.filter((s) => (s.status || "").toLowerCase() === "free").length;
        const occupiedSlots = allSlots.filter((s) => (s.status || "").toLowerCase() === "occupied").length;
        const reservedSlots = allSlots.filter((s) => (s.status || "").toLowerCase() === "reserved").length;
        const activeSessions = myReservations.filter((r) =>
          ["pending", "confirmed", "active"].includes((r.status || "").toLowerCase())
        ).length;

        setStats({
          totalSlots,
          freeSlots,
          occupiedSlots,
          reservedSlots,
          activeSessions,
          revenueToday: 0,
          pendingReservations: myReservations.filter((r) => (r.status || "").toLowerCase() === "pending").length,
          reservationsToday: myReservations.filter((r) => {
            const start = r.startTime ? new Date(r.startTime) : null;
            if (!start || Number.isNaN(start.getTime())) return false;
            const today = new Date();
            return start.toDateString() === today.toDateString();
          }).length,
        });
        setSource(slotsResponse.source === "mock" ? "mock" : "api");
        return;
      }

      const res = await fetchDashboardStats();
      const { data: reservationsData } = await api.get("/reservations");
      const reservations = Array.isArray(reservationsData) ? reservationsData : [];
      const latest = reservations
        .slice()
        .sort((a, b) => {
          const ad = new Date(a.startTime || 0).getTime();
          const bd = new Date(b.startTime || 0).getTime();
          return bd - ad;
        })
        .slice(0, 5);
      setLatestReservations(latest);
      const reservedSlots = allSlots.filter((s) => (s.status || "").toLowerCase() === "reserved").length;
      setStats({
        ...res.data,
        reservedSlots,
      });
      setSource(res.source === "mock" || slotsResponse.source === "mock" ? "mock" : "api");
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
    } catch {
      setError("Gabim ne ngarkim");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    loadDashboard();
  }, []);
=======
    loadStats();
  }, [isAdmin]);
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)

  if (loading) return <div className="loading">Duke u ngarkuar...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div className="loading">Nuk ka te dhena.</div>;

  const occupancyRate =
    stats.totalSlots > 0 ? Math.round((stats.occupiedSlots / stats.totalSlots) * 100) : 0;
  const availabilityRate =
    stats.totalSlots > 0 ? Math.round((stats.freeSlots / stats.totalSlots) * 100) : 0;
<<<<<<< HEAD

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
=======
  const reservedRate =
    stats.totalSlots > 0 ? Math.round(((stats.reservedSlots || 0) / stats.totalSlots) * 100) : 0;

  const cards = [
    { label: "Total Parking Slots", value: stats.totalSlots, tone: "blue" },
    { label: "Available Slots", value: stats.freeSlots, tone: "green" },
    { label: "Occupied Slots", value: stats.occupiedSlots, tone: "orange" },
    { label: "Reserved Slots", value: stats.reservedSlots || 0, tone: "amber" },
    { label: "Active Sessions", value: stats.activeSessions, tone: "purple" },
    { label: "Pending Reservations", value: stats.pendingReservations || 0, tone: "purple" },
    { label: "Reservations Today", value: stats.reservationsToday || 0, tone: "blue" },
    { label: "Revenue Today", value: `${Number(stats.revenueToday || 0).toFixed(2)} EUR`, tone: "dark" },
  ];

  const userCards = [
    { label: "Available Slots", value: stats.freeSlots, tone: "green" },
    { label: "Parking Occupancy", value: `${occupancyRate}%`, tone: "orange" },
    { label: "Reserved Slots", value: stats.reservedSlots || 0, tone: "amber" },
    { label: "My Active Reservations", value: stats.activeSessions, tone: "purple" },
  ];

  const availableSlots = slots.filter((slot) => (slot.status || "").toLowerCase() === "free");
  const groupedByZone = availableSlots.reduce((acc, slot) => {
    const zone = slot.zoneId ?? "N/A";
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(slot);
    return acc;
  }, {});
  const sortedZones = Object.keys(groupedByZone).sort((a, b) => Number(a) - Number(b));

  const sortSlotsNaturally = (a, b) => {
    const getNum = (slotNo) => Number((slotNo || "").replace(/^[A-Za-z]+/, "")) || 0;
    return getNum(a.slotNumber) - getNum(b.slotNumber);
  };

  const selectedDetailedSlot = availableDetailedSlots.find((s) => Number(s.slotId) === Number(reserveForm.slotId));
  const hourlyRate = Number(selectedDetailedSlot?.hourlyRate || 0);
  const selectedDurationHours = Number(reserveForm.durationHours || 0);
  const estimatedCost = Math.max(0, hourlyRate * selectedDurationHours);
  const latestReservationTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];
  const latestTabCounts = (() => {
    const counts = {
      all: latestReservations.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    latestReservations.forEach((r) => {
      const key = (r.status || "").toLowerCase();
      if (counts[key] !== undefined) counts[key] += 1;
    });

    return counts;
  })();
  const filteredLatestReservations = (() => {
    if (latestStatusTab === "all") return latestReservations;
    return latestReservations.filter((r) => (r.status || "").toLowerCase() === latestStatusTab);
  })();

  const openReserveModal = () => {
    setReserveError("");
    setReserveSuccess("");
    const firstSlot = availableDetailedSlots[0];
    setReserveForm({
      slotId: firstSlot ? String(firstSlot.slotId) : "",
      plateNumber: "",
      startDate: "",
      startTime: "",
      durationHours: 2,
      endDate: "",
      endTime: "",
    });
    setReserveMode("duration");
    setReserveOpen(true);
  };

  const closeReserveModal = () => {
    setReserveOpen(false);
    setReserveLoading(false);
  };

  const onReserveFieldChange = (e) => {
    const { name, value } = e.target;
    setReserveForm((prev) => ({ ...prev, [name]: value }));
  };

  const toIsoFromDateTime = (date, time) => {
    if (!date || !time) return null;
    const localDate = new Date(`${date}T${time}`);
    if (Number.isNaN(localDate.getTime())) return null;
    return localDate.toISOString();
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    setReserveError("");
    setReserveSuccess("");

    if (!reserveForm.slotId) {
      setReserveError("Please select an available slot.");
      return;
    }

    if (!reserveForm.plateNumber.trim()) {
      setReserveError("Please enter a vehicle plate number.");
      return;
    }

    const startIso = toIsoFromDateTime(reserveForm.startDate, reserveForm.startTime);
    if (!startIso) {
      setReserveError("Please provide a valid start date and time.");
      return;
    }

    let endIso = null;
    if (reserveMode === "duration") {
      const hours = Number(reserveForm.durationHours);
      if (!hours || hours <= 0) {
        setReserveError("Please select a valid duration.");
        return;
      }
      const startDate = new Date(startIso);
      endIso = new Date(startDate.getTime() + hours * 60 * 60 * 1000).toISOString();
    } else {
      endIso = toIsoFromDateTime(reserveForm.endDate, reserveForm.endTime);
      if (!endIso) {
        setReserveError("Please provide a valid end date and time.");
        return;
      }
      if (new Date(endIso) <= new Date(startIso)) {
        setReserveError("End time must be later than start time.");
        return;
      }
    }

    try {
      setReserveLoading(true);
      const payload = {
        slotId: Number(reserveForm.slotId),
        vehicleId: null,
        startTime: startIso,
        endTime: endIso,
      };
      const { data } = await api.post("/reservations", payload);
      setReserveSuccess(`Reservation created successfully. ID: ${data.reservationId}`);
      await loadStats();
      setTimeout(() => {
        closeReserveModal();
      }, 900);
    } catch (err) {
      setReserveError(err.response?.data?.message || "Failed to create reservation.");
    } finally {
      setReserveLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h2>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</h2>
          <p className="dashboard-subtitle">
            {isAdmin
              ? "Welcome back. Here's what's happening across the parking system."
              : `Welcome ${user?.email || ""}. Here is your user view for parking availability.`}
          </p>
        </div>
      </div>

      {isAdmin && source === "mock" && <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>}

      <div className="stats-grid">{(isAdmin ? cards : userCards).map((c) => (
        <div className={`stat-card stat-card-${c.tone}`} key={c.label}>
          <div className="stat-label">{c.label}</div>
          <div className="stat-value">{c.value}</div>
        </div>
      ))}</div>

      <div className="dashboard-insights">
        <div className="insight-row">
          <span>Parking occupancy</span>
          <strong>{occupancyRate}%</strong>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-occupied" style={{ width: `${occupancyRate}%` }} />
        </div>

        <div className="insight-row">
          <span>Availability</span>
          <strong>{availabilityRate}%</strong>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-free" style={{ width: `${availabilityRate}%` }} />
        </div>

        <div className="insight-row">
          <span>Reserved rate</span>
          <strong>{reservedRate}%</strong>
        </div>
        <div className="progress-bar">
          <div className="progress-fill progress-fill-reserved" style={{ width: `${reservedRate}%` }} />
        </div>
      </div>

      <div className="dashboard-lower-grid">
        <section className="dashboard-map-card">
          <div className="dashboard-map-head">
            <h3>Interactive Parking Map</h3>
            <div className="dashboard-map-legend">
              <span className="legend-dot legend-free" />
              <span>Available</span>
            </div>
          </div>

          {sortedZones.length === 0 ? (
            <p className="dashboard-empty-map">No available slots right now.</p>
          ) : (
            sortedZones.map((zoneId) => (
              <div className="dashboard-zone-block" key={zoneId}>
                <h4>Zone {zoneId}</h4>
                <div className="dashboard-slot-grid">
                  {groupedByZone[zoneId]
                    .slice()
                    .sort(sortSlotsNaturally)
                    .map((slot) => (
                      <div className="dashboard-slot dashboard-slot-free" key={slot.slotId}>
                        {slot.slotNumber}
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </section>

        <aside className="dashboard-actions-card">
          <h3>Quick Actions</h3>
          <button
            className="quick-action-btn quick-action-blue"
            type="button"
            onClick={openReserveModal}
          >
            <span className="quick-action-icon">P</span>
            <span className="quick-action-text">
              <strong>Reserve a Parking Slot</strong>
              <small>
                {availableDetailedSlots.length > 0
                  ? "Create a new parking reservation"
                  : "Currently no free slots, open to check details"}
              </small>
            </span>
          </button>
          <button
            className="quick-action-btn quick-action-purple"
            type="button"
            onClick={() => navigate("/vehicles")}
          >
            <span className="quick-action-icon">V</span>
            <span className="quick-action-text">
              <strong>Add Vehicle</strong>
              <small>Open My Vehicles and manage your cars</small>
            </span>
          </button>
          <button
            className="quick-action-btn quick-action-green"
            type="button"
            onClick={() => (isAdmin ? navigate("/reservations") : openReserveModal())}
          >
            <span className="quick-action-icon">{isAdmin ? "$" : "R"}</span>
            <span className="quick-action-text">
              <strong>{isAdmin ? "View Payment History" : "My Reservations"}</strong>
              <small>
                {isAdmin ? "Track payments and daily revenue flow" : "Open reservation modal and book a slot"}
              </small>
            </span>
          </button>
          <p className="quick-action-note">
            {isAdmin
              ? "Admin mode: monitor occupancy and manage operations."
              : "User mode: check available slots and manage your bookings."}
          </p>

          {!isAdmin && (
            <section className="user-info-card">
              <h3>Your Information</h3>
              <p className="user-info-subtitle">Active Vehicle</p>
              {activeVehicle ? (
                <div className="active-vehicle-card">
                  <div className="active-vehicle-icon">🚗</div>
                  <div>
                    <strong>
                      {[activeVehicle.brand, activeVehicle.model].filter(Boolean).join(" ") || "My Vehicle"}
                    </strong>
                    <p>{activeVehicle.plateNumber}</p>
                  </div>
                </div>
              ) : (
                <div className="state-banner state-info">
                  No active vehicle selected yet. Add one from <strong>My Vehicles</strong>.
                </div>
              )}
            </section>
          )}
        </aside>
      </div>

      {isAdmin && (
        <section className="dashboard-latest-card">
          <h3>Latest Reservations</h3>
          <div className="reservation-toolbar">
            <div className="reserve-mode-tabs reservations-status-tabs">
              {latestReservationTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={latestStatusTab === tab.key ? "active" : ""}
                  onClick={() => setLatestStatusTab(tab.key)}
                >
                  {tab.label} <span className="tab-count">{latestTabCounts[tab.key] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Slot ID</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLatestReservations.map((r) => (
                  <tr key={r.reservationId ?? r.id}>
                    <td>{r.reservationId ?? r.id}</td>
                    <td>{r.userId ?? "-"}</td>
                    <td>{r.slotId ?? "-"}</td>
                    <td>{r.startTime ? new Date(r.startTime).toLocaleString() : "-"}</td>
                    <td>{r.endTime ? new Date(r.endTime).toLocaleString() : "-"}</td>
                    <td>
                      <span className={`badge badge-${(r.status || "pending").toLowerCase()}`}>
                        {r.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLatestReservations.length === 0 && (
                  <tr>
                    <td colSpan={6}>No reservations yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {reserveOpen && (
        <div className="reserve-modal-overlay" onClick={closeReserveModal}>
          <div className="reserve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reserve-modal-header">
              <h3>Reserve Parking Slot</h3>
              <button type="button" className="reserve-close-btn" onClick={closeReserveModal}>
                X
              </button>
            </div>

            <form className="reserve-modal-body" onSubmit={submitReservation}>
              <div className="reserve-slot-box">
                <div>
                  <h4>Slot {selectedDetailedSlot?.slotNumber || "-"}</h4>
                  <p>{selectedDetailedSlot?.zoneName || "Unknown Zone"} • Level 1</p>
                  <strong>${hourlyRate.toFixed(2)}/hour</strong>
                </div>
                <span className="reserve-status-pill">
                  {selectedDetailedSlot ? "Available" : "Unavailable"}
                </span>
              </div>

              <label>Choose available slot</label>
              <select
                name="slotId"
                value={reserveForm.slotId}
                onChange={onReserveFieldChange}
                required
                disabled={availableDetailedSlots.length === 0}
              >
                {availableDetailedSlots.length === 0 && (
                  <option value="">No available slots</option>
                )}
                {availableDetailedSlots.map((slot) => (
                  <option key={slot.slotId} value={slot.slotId}>
                    {slot.slotNumber} - {slot.zoneName}
                  </option>
                ))}
              </select>

              {availableDetailedSlots.length === 0 && (
                <div className="state-banner state-error">
                  There are no available parking slots right now. Try again after refresh.
                </div>
              )}

              <label>License Plate Number</label>
              <input
                name="plateNumber"
                value={reserveForm.plateNumber}
                onChange={onReserveFieldChange}
                placeholder="ABC-1234"
                required
              />

              <div className="reserve-datetime-grid">
                <div>
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={reserveForm.startDate} onChange={onReserveFieldChange} required />
                </div>
                <div>
                  <label>Start Time</label>
                  <input type="time" name="startTime" value={reserveForm.startTime} onChange={onReserveFieldChange} required />
                </div>
              </div>

              <div className="reserve-mode-tabs">
                <button
                  type="button"
                  className={reserveMode === "duration" ? "active" : ""}
                  onClick={() => setReserveMode("duration")}
                >
                  By Duration
                </button>
                <button
                  type="button"
                  className={reserveMode === "endTime" ? "active" : ""}
                  onClick={() => setReserveMode("endTime")}
                >
                  By End Time
                </button>
              </div>

              {reserveMode === "duration" ? (
                <div>
                  <label>Duration (hours)</label>
                  <div className="reserve-duration-options">
                    {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => (
                      <button
                        key={h}
                        type="button"
                        className={Number(reserveForm.durationHours) === h ? "active" : ""}
                        onClick={() => setReserveForm((prev) => ({ ...prev, durationHours: h }))}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="reserve-datetime-grid">
                  <div>
                    <label>End Date</label>
                    <input type="date" name="endDate" value={reserveForm.endDate} onChange={onReserveFieldChange} required />
                  </div>
                  <div>
                    <label>End Time</label>
                    <input type="time" name="endTime" value={reserveForm.endTime} onChange={onReserveFieldChange} required />
                  </div>
                </div>
              )}

              <div className="reserve-summary">
                <h4>Price Summary</h4>
                <div><span>Hourly Rate</span><strong>${hourlyRate.toFixed(2)}/hour</strong></div>
                <div><span>Duration</span><strong>{selectedDurationHours} hours</strong></div>
                <div className="reserve-total"><span>Total Cost</span><strong>${estimatedCost.toFixed(2)}</strong></div>
              </div>

              {reserveError && <div className="error">{reserveError}</div>}
              {reserveSuccess && <div className="state-banner state-info">{reserveSuccess}</div>}

              <div className="reserve-actions">
                <button type="button" className="btn btn-secondary" onClick={closeReserveModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={reserveLoading || !selectedDetailedSlot}
                >
                  {reserveLoading ? "Confirming..." : "Confirm Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
    </div>
  );
}
