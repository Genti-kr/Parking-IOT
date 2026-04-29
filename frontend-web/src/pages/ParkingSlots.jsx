import { useEffect, useState } from "react";
import { fetchParkingSlots } from "../services/mockData.js";

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [source, setSource] = useState("api");

  const load = () => {
    fetchParkingSlots()
      .then((res) => {
        setSlots(res.data);
        setSource(res.source);
        setError("");
      })
      .catch(() => setError("Gabim ne ngarkim te vendeve"));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2>Vendet e lira te parkimit</h2>
      {source === "mock" && (
        <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>
      )}
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
