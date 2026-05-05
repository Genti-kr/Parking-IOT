import { useEffect, useMemo, useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyForm = { plateNumber: "", brand: "", model: "" };

export default function MyVehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [primaryVehicleId, setPrimaryVehicleId] = useState(null);
  const activeVehicleStorageKey = user?.userId ? `activeVehicleId:${user.userId}` : "activeVehicleId";

  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  const loadVehicles = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/vehicles");
      const list = Array.isArray(data) ? data : [];
      setVehicles(list);
      const storedPrimaryId = Number(localStorage.getItem(activeVehicleStorageKey));
      const hasStoredPrimary = list.some((v) => v.vehicleId === storedPrimaryId);
      const nextPrimaryId = hasStoredPrimary ? storedPrimaryId : list[0]?.vehicleId ?? null;
      setPrimaryVehicleId(nextPrimaryId);
      if (nextPrimaryId) {
        localStorage.setItem(activeVehicleStorageKey, String(nextPrimaryId));
      } else {
        localStorage.removeItem(activeVehicleStorageKey);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const sortedVehicles = useMemo(
    () =>
      vehicles
        .slice()
        .sort((a, b) => {
          if (a.vehicleId === primaryVehicleId) return -1;
          if (b.vehicleId === primaryVehicleId) return 1;
          return a.vehicleId - b.vehicleId;
        }),
    [vehicles, primaryVehicleId]
  );

  const openCreate = () => {
    setEditingVehicleId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEdit = (vehicle) => {
    setEditingVehicleId(vehicle.vehicleId);
    setForm({
      plateNumber: vehicle.plateNumber || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitVehicle = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.plateNumber.trim()) {
      setError("License plate is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        plateNumber: form.plateNumber,
        brand: form.brand || null,
        model: form.model || null,
      };

      if (editingVehicleId) {
        await api.put(`/vehicles/${editingVehicleId}`, payload);
        setSuccess("Vehicle updated successfully.");
      } else {
        const { data } = await api.post("/vehicles", payload);
        setSuccess("Vehicle added successfully.");
        if (!primaryVehicleId) {
          setPrimaryVehicleId(data.vehicleId);
          localStorage.setItem(activeVehicleStorageKey, String(data.vehicleId));
        }
      }

      await loadVehicles();
      setShowModal(false);
      setForm(emptyForm);
      setEditingVehicleId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const deleteVehicle = async (vehicleId) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/vehicles/${vehicleId}`);
      if (primaryVehicleId === vehicleId) {
        const remaining = vehicles.filter((v) => v.vehicleId !== vehicleId);
        const fallbackVehicleId = remaining[0]?.vehicleId ?? null;
        setPrimaryVehicleId(fallbackVehicleId);
        if (fallbackVehicleId) {
          localStorage.setItem(activeVehicleStorageKey, String(fallbackVehicleId));
        } else {
          localStorage.removeItem(activeVehicleStorageKey);
        }
      }
      setSuccess("Vehicle deleted.");
      await loadVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete vehicle.");
    }
  };

  if (isAdmin) {
    return (
      <section>
        <h2>My Vehicles</h2>
        <div className="state-banner state-info">
          This section is only for normal users. Admin accounts do not manage personal vehicles.
        </div>
      </section>
    );
  }

  return (
    <section className="vehicles-page">
      <div className="vehicles-header">
        <div>
          <h2>My Vehicles</h2>
          <p>Manage your registered vehicles for parking reservations</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={openCreate}>
          + Add New Vehicle
        </button>
      </div>

      {error && <div className="state-banner state-error">{error}</div>}
      {success && <div className="state-banner state-info">{success}</div>}

      {loading ? (
        <div className="loading">Loading vehicles...</div>
      ) : (
        <div className="vehicles-grid">
          {sortedVehicles.map((vehicle) => {
            const isPrimary = vehicle.vehicleId === primaryVehicleId;
            return (
              <article key={vehicle.vehicleId} className="vehicle-card">
                <div className="vehicle-card-head">
                  <div className="vehicle-badge">CAR</div>
                  <div>
                    <h3>{[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "My Vehicle"}</h3>
                    <p>{isPrimary ? "Primary vehicle" : "Registered vehicle"}</p>
                  </div>
                  {isPrimary && <span className="vehicle-star">★</span>}
                </div>
                <div className="vehicle-card-body">
                  <div className="vehicle-label">License Plate</div>
                  <div className="vehicle-plate">{vehicle.plateNumber}</div>
                  <div className="vehicle-tags">
                    <span className="vehicle-tag active">Active</span>
                    {isPrimary && <span className="vehicle-tag primary">Primary</span>}
                  </div>
                  <div className="vehicle-actions">
                    {!isPrimary && (
                      <button
                        type="button"
                        className="vehicle-action-main"
                        onClick={() => {
                          setPrimaryVehicleId(vehicle.vehicleId);
                          localStorage.setItem(activeVehicleStorageKey, String(vehicle.vehicleId));
                        }}
                      >
                        Set Primary
                      </button>
                    )}
                    <button type="button" className="vehicle-icon-btn" onClick={() => openEdit(vehicle)}>
                      Edit
                    </button>
                    <button type="button" className="vehicle-icon-btn danger" onClick={() => deleteVehicle(vehicle.vehicleId)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {sortedVehicles.length === 0 && <p>No vehicles yet. Click "Add New Vehicle".</p>}
        </div>
      )}

      {showModal && (
        <div className="reserve-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="reserve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reserve-modal-header">
              <h3>{editingVehicleId ? "Edit Vehicle" : "Add New Vehicle"}</h3>
              <button type="button" className="reserve-close-btn" onClick={() => setShowModal(false)}>
                X
              </button>
            </div>
            <form className="reserve-modal-body" onSubmit={submitVehicle}>
              <label>License Plate</label>
              <input name="plateNumber" value={form.plateNumber} onChange={onFieldChange} placeholder="ABC-1234" required />

              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={onFieldChange} placeholder="Toyota" />

              <label>Model</label>
              <input name="model" value={form.model} onChange={onFieldChange} placeholder="Camry" />

              <div className="reserve-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editingVehicleId ? "Update Vehicle" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
