import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/parking/available")
      .then((res) => setSlots(res.data))
      .catch((err) => setError(err.response?.data?.message || "Gabim"));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2>Vendet e lira te parkimit</h2>
      {error && <div className="error">{error}</div>}
      <div className="slots-grid">
        {slots.map((s) => (
          <div className={`slot slot-${s.status.toLowerCase()}`} key={s.slotId}>
            <div className="slot-number">{s.slotNumber}</div>
            <div className="slot-status">{s.status}</div>
          </div>
        ))}
        {slots.length === 0 && <p>Nuk ka vende te lira momentalisht.</p>}
      </div>
    </div>
  );
}
