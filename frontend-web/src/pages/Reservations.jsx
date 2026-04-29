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
    </div>
  );
}
