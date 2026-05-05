import api from "./api.js";

const mockSlots = [
  { slotId: 1, slotNumber: "A1", status: "FREE" },
  { slotId: 2, slotNumber: "A2", status: "OCCUPIED" },
  { slotId: 3, slotNumber: "A3", status: "FREE" },
  { slotId: 4, slotNumber: "B1", status: "OCCUPIED" },
  { slotId: 5, slotNumber: "B2", status: "FREE" },
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
  return withFallback(() => api.get("/parking/available"), mockSlots);
}

export function fetchDashboardStats() {
  return withFallback(() => api.get("/dashboard/stats"), mockStats);
}

export function fetchReservations() {
  return Promise.resolve({ data: mockReservations, source: "mock" });
}
