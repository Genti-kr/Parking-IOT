using SmartParking.API.Entities;
using SmartParking.API.Models;

namespace SmartParking.API.Services;

public interface IParkingService
{
    Task<IEnumerable<ParkingSlot>> GetSlotsAsync(string? status = null);
    Task<IEnumerable<ParkingSlot>> GetAvailableAsync();
    Task<bool> UpdateSlotStatusAsync(SlotUpdateRequest request);
    Task<ParkingSession?> EntryAsync(EntryRequest request);
    Task<ParkingSession?> ExitAsync(ExitRequest request);
    Task<IEnumerable<ReservationDto>> GetReservationsAsync(string? status = null);
    Task<ReservationDto?> CreateReservationAsync(ReservationCreateRequest request);
    Task<ReservationDto?> UpdateReservationStatusAsync(int reservationId, string status);
    Task<DashboardStats> GetStatsAsync();
}
