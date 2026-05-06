import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchParkingSlots } from "../services/mockData.js";

export default function ParkingSlots() {
  const location = useLocation();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState("");
  const [source, setSource] = useState("api");
  const detailsRef = useRef(null);

  const load = () => {
    fetchParkingSlots()
      .then((res) => {
        const normalized = (Array.isArray(res.data) ? res.data : []).map((slot) => ({
          ...slot,
          status: (slot.status || "FREE").toString().toUpperCase(),
        }));
        setSlots(normalized);
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

  useEffect(() => {
    const selectedSlotId = Number(location.state?.selectedSlotId);
    if (!selectedSlotId || slots.length === 0) return;

    const slotFromMap = slots.find((slot) => Number(slot.slotId) === selectedSlotId);
    if (!slotFromMap) return;

    setSelectedSlot(slotFromMap);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, [location.state, slots]);

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
  const selectedZoneLabel = selectedSlot?.slotNumber?.charAt(0)?.toUpperCase() || (selectedSlot?.zoneId ?? "-");
  const selectedStatusLabel = selectedSlot
    ? selectedSlot.status.charAt(0) + selectedSlot.status.slice(1).toLowerCase()
    : "";
  const isSelectedSlotAvailable = (selectedSlot?.status || "") === "FREE";

  return (
    <div className="parking-page">
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
              <button
                type="button"
                className={`slot slot-${s.status.toLowerCase()} ${selectedSlot?.slotId === s.slotId ? "slot-selected" : ""}`}
                key={s.slotId}
                onClick={() => setSelectedSlot(s)}
              >
                <div className="slot-number">{s.slotNumber}</div>
              </button>
            ))}
          </div>
        </section>
      ))}
      {slots.length === 0 && <p>Nuk ka vende te parkimit momentalisht.</p>}

      {selectedSlot && (
        <section className="slot-details-panel" ref={detailsRef}>
          <h3>Slot Details: {selectedSlot.slotNumber}</h3>
          <p><strong>Zone:</strong> {selectedZoneLabel}</p>
          <p><strong>Status:</strong> {selectedStatusLabel}</p>
          <div className="slot-details-actions">
            <button type="button" className="slot-reserve-btn" disabled={!isSelectedSlotAvailable}>
              Reserve Slot
            </button>
            <button type="button" className="slot-close-btn" onClick={() => setSelectedSlot(null)}>
              Close
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
