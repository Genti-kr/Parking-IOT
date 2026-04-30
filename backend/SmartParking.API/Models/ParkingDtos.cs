namespace SmartParking.API.Models;

public record SlotUpdateRequest(int SlotId, string Status, DateTime? Timestamp);

public record EntryRequest(int SlotId, string? PlateNumber, int? UserId);

public record ExitRequest(int SessionId);

public record ReservationListItem(
    int Id,
    string FullName,
    string? PlateNumber,
    string SlotNumber,
    DateTime StartTime,
    DateTime EndTime,
    string Status);

public record DashboardStats(
    int TotalSlots,
    int FreeSlots,
    int OccupiedSlots,
    int ActiveSessions,
    decimal RevenueToday);
