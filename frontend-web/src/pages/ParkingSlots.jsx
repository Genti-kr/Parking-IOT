import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setError("");
    setLoading(true);
    api
      .get("/parking/available")
      .then((res) => setSlots(res.data))
      .catch((err) => setError(err.response?.data?.message || "Gabim"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section>
      <div className="section-head">
        <h3 className="section-title">Vendet e parkimit</h3>
        <button className="btn btn-secondary" onClick={load}>
          Rifresko
        </button>
      </div>

      {error && (
        <div className="state-card">
          <div className="state-banner state-error">{error}</div>
          <button className="btn btn-primary" onClick={load}>
            Provo perseri
          </button>
        </div>
      )}

      {!error && loading && (
        <div className="state-card">
          <div className="spinner" aria-hidden="true" />
          <p>Duke u ngarkuar vendet...</p>
        </div>
      )}

      {!error && !loading && (
        <div className="slots-grid">
          {slots.map((s) => (
            <div className={`slot slot-${s.status.toLowerCase()}`} key={s.slotId}>
              <div className="slot-number">{s.slotNumber}</div>
              <div className="slot-status">{s.status}</div>
            </div>
          ))}
          {slots.length === 0 && (
            <div className="state-banner state-info">
              Nuk ka vende te lira momentalisht.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
