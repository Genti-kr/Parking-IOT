namespace SmartParking.API.Models;

public record SlotUpdateRequest(int SlotId, string Status, DateTime? Timestamp);

public record EntryRequest(int SlotId, string? PlateNumber, int? UserId);

public record ExitRequest(int SessionId);

public record DashboardStats(
    int TotalSlots,
    int FreeSlots,
    int OccupiedSlots,
    int ActiveSessions,
    decimal RevenueToday);
