namespace SmartParking.API.Models;

public record SlotUpdateRequest(int SlotId, string Status, DateTime? Timestamp);

public record EntryRequest(int SlotId, string? PlateNumber, int? UserId);

public record ExitRequest(int SessionId);

public record ReservationCreateRequest(
    int UserId,
    int SlotId,
    int? VehicleId,
    DateTime StartTime,
    DateTime EndTime);

public record ReservationStatusUpdateRequest(string Status);

public record ReservationDto(
    int ReservationId,
    int UserId,
    int SlotId,
    int? VehicleId,
    DateTime StartTime,
    DateTime EndTime,
    string Status);

public record DashboardStats(
    int TotalSlots,
    int FreeSlots,
    int OccupiedSlots,
    int ActiveSessions,
<<<<<<< HEAD
    decimal RevenueToday);
=======
    decimal RevenueToday,
    int PendingReservations,
    int ReservationsToday);

public record AvailableSlotDto(
    int SlotId,
    string SlotNumber,
    int ZoneId,
    string ZoneName,
    decimal HourlyRate,
    string Status);

public record VehicleUpsertRequest(
    string PlateNumber,
    string? Brand,
    string? Model);

public record VehicleDto(
    int VehicleId,
    int UserId,
    string PlateNumber,
    string? Brand,
    string? Model);
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
