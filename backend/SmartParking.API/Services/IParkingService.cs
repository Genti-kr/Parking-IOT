using SmartParking.API.Entities;
using SmartParking.API.Models;

namespace SmartParking.API.Services;

public interface IParkingService
{
    Task<IEnumerable<ParkingSlot>> GetAvailableAsync();
    Task<IEnumerable<ReservationListItem>> GetReservationsAsync(int? userId, bool includeAll);
    Task<bool> UpdateSlotStatusAsync(SlotUpdateRequest request);
    Task<ParkingSession?> EntryAsync(EntryRequest request, int? effectiveUserId);
    Task<ParkingSession?> ExitAsync(ExitRequest request);
    Task<DashboardStats> GetStatsAsync();
}
