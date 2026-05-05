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

  const groupedByZone = slots.reduce((acc, slot) => {
    const zoneKey = slot.zoneId ?? "N/A";
    if (!acc[zoneKey]) acc[zoneKey] = [];
    acc[zoneKey].push(slot);
    return acc;
  }, {});

  const sortedZones = Object.keys(groupedByZone).sort((a, b) => Number(a) - Number(b));
  const sortSlotsNaturally = (a, b) => {
    const getNumber = (slotNumber) => Number((slotNumber || "").replace(/^[A-Za-z]+/, "")) || 0;
    return getNumber(a.slotNumber) - getNumber(b.slotNumber);
  };

  return (
    <div>
      <h2>Vendet e parkimit</h2>
      {source === "mock" && (
        <p className="info-banner">Po shfaqen te dhena demo (mock data).</p>
      )}
      {error && <div className="error">{error}</div>}
      {sortedZones.map((zoneId) => (
        <section className="zone-section" key={zoneId}>
          <h3 className="zone-title">Zona {zoneId}</h3>
          <div className="slots-grid">
            {groupedByZone[zoneId].sort(sortSlotsNaturally).map((s) => (
              <div className={`slot slot-${s.status.toLowerCase()}`} key={s.slotId}>
                <div className="slot-number">{s.slotNumber}</div>
                <div className="slot-status">{s.status}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
      {slots.length === 0 && <p>Nuk ka vende te parkimit momentalisht.</p>}
    </div>
  );
}
