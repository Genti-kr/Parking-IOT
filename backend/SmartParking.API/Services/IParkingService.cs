using SmartParking.API.Entities;
using SmartParking.API.Models;

namespace SmartParking.API.Services;

public interface IParkingService
{
    Task<IEnumerable<ParkingSlot>> GetSlotsAsync(string? status = null);
    Task<IEnumerable<ParkingSlot>> GetAvailableAsync();
<<<<<<< HEAD
=======
    Task<IEnumerable<AvailableSlotDto>> GetAvailableDetailedAsync();
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
    Task<bool> UpdateSlotStatusAsync(SlotUpdateRequest request);
    Task<ParkingSession?> EntryAsync(EntryRequest request);
    Task<ParkingSession?> ExitAsync(ExitRequest request);
    Task<IEnumerable<ReservationDto>> GetReservationsAsync(string? status = null);
<<<<<<< HEAD
    Task<ReservationDto?> CreateReservationAsync(ReservationCreateRequest request);
    Task<ReservationDto?> UpdateReservationStatusAsync(int reservationId, string status);
    Task<DashboardStats> GetStatsAsync();
=======
    Task<IEnumerable<ReservationDto>> GetReservationsForUserAsync(int userId, string? status = null);
    Task<ReservationDto?> CreateReservationAsync(ReservationCreateRequest request);
    Task<ReservationDto?> UpdateReservationStatusAsync(int reservationId, string status);
    Task<DashboardStats> GetStatsAsync();
    Task<IEnumerable<VehicleDto>> GetVehiclesForUserAsync(int userId);
    Task<VehicleDto?> CreateVehicleAsync(int userId, VehicleUpsertRequest request);
    Task<VehicleDto?> UpdateVehicleAsync(int vehicleId, int userId, VehicleUpsertRequest request);
    Task<bool> DeleteVehicleAsync(int vehicleId, int userId);
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
}
