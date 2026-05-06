import api from "./api.js";

const mockSlots = [
  { slotId: 1, slotNumber: "A1", zoneId: 1, status: "FREE" },
  { slotId: 2, slotNumber: "A2", zoneId: 1, status: "FREE" },
  { slotId: 3, slotNumber: "A3", zoneId: 1, status: "OUTOFSERVICE" },
  { slotId: 4, slotNumber: "A4", zoneId: 1, status: "OCCUPIED" },
  { slotId: 5, slotNumber: "A5", zoneId: 1, status: "OCCUPIED" },
  { slotId: 6, slotNumber: "A6", zoneId: 1, status: "OCCUPIED" },
  { slotId: 7, slotNumber: "A7", zoneId: 1, status: "OCCUPIED" },
  { slotId: 8, slotNumber: "A8", zoneId: 1, status: "OUTOFSERVICE" },
  { slotId: 9, slotNumber: "A9", zoneId: 1, status: "RESERVED" },
  { slotId: 10, slotNumber: "A10", zoneId: 1, status: "RESERVED" },
  { slotId: 11, slotNumber: "B1", zoneId: 2, status: "FREE" },
  { slotId: 12, slotNumber: "B2", zoneId: 2, status: "RESERVED" },
  { slotId: 13, slotNumber: "B3", zoneId: 2, status: "OUTOFSERVICE" },
  { slotId: 14, slotNumber: "B4", zoneId: 2, status: "FREE" },
  { slotId: 15, slotNumber: "B5", zoneId: 2, status: "RESERVED" },
  { slotId: 16, slotNumber: "B6", zoneId: 2, status: "OCCUPIED" },
  { slotId: 17, slotNumber: "B7", zoneId: 2, status: "FREE" },
  { slotId: 18, slotNumber: "B8", zoneId: 2, status: "FREE" },
  { slotId: 19, slotNumber: "B9", zoneId: 2, status: "RESERVED" },
  { slotId: 20, slotNumber: "B10", zoneId: 2, status: "FREE" },
  { slotId: 21, slotNumber: "C1", zoneId: 3, status: "FREE" },
  { slotId: 22, slotNumber: "C2", zoneId: 3, status: "RESERVED" },
  { slotId: 23, slotNumber: "C3", zoneId: 3, status: "OCCUPIED" },
  { slotId: 24, slotNumber: "C4", zoneId: 3, status: "RESERVED" },
  { slotId: 25, slotNumber: "C5", zoneId: 3, status: "RESERVED" },
  { slotId: 26, slotNumber: "C6", zoneId: 3, status: "OUTOFSERVICE" },
  { slotId: 27, slotNumber: "C7", zoneId: 3, status: "OUTOFSERVICE" },
  { slotId: 28, slotNumber: "C8", zoneId: 3, status: "FREE" },
  { slotId: 29, slotNumber: "C9", zoneId: 3, status: "RESERVED" },
  { slotId: 30, slotNumber: "C10", zoneId: 3, status: "FREE" },
];

const mockReservations = [
  {
    id: 101,
    fullName: "Ardit Krasniqi",
    plateNumber: "01-123-AB",
    slotNumber: "A2",
    startTime: "2026-04-23 09:00",
    endTime: "2026-04-23 11:00",
    status: "ACTIVE",
  },
  {
    id: 102,
    fullName: "Era Hoxha",
    plateNumber: "02-456-CD",
    slotNumber: "B1",
    startTime: "2026-04-23 08:30",
    endTime: "2026-04-23 10:30",
    status: "COMPLETED",
  },
];

const mockStats = {
  totalSlots: 20,
  freeSlots: 12,
  occupiedSlots: 8,
  activeSessions: 5,
  revenueToday: 42.5,
  pendingReservations: 4,
  reservationsToday: 7,
};

async function withFallback(apiCall, mockValue) {
  try {
    const { data } = await apiCall();
    return { data, source: "api" };
  } catch {
    return { data: mockValue, source: "mock" };
  }
}

export function fetchParkingSlots() {
  return withFallback(
    async () => {
      const res = await api.get("/parking/slots");
      const data = Array.isArray(res.data) ? res.data : [];
      // If API is reachable but DB has no seeded slots yet, keep UI usable with mock slots.
      if (data.length === 0) {
        return { ...res, data: mockSlots };
      }
      return res;
    },
    mockSlots
  );
}

export function fetchDashboardStats() {
  return withFallback(() => api.get("/dashboard/stats"), mockStats);
}

export function fetchReservations() {
  return withFallback(() => api.get("/reservations"), mockReservations);
}
