using SmartParking.API.Entities;
using SmartParking.API.Models;

namespace SmartParking.API.Services;

public interface IParkingService
{
    Task<IEnumerable<ParkingSlot>> GetAvailableAsync();
    Task<bool> UpdateSlotStatusAsync(SlotUpdateRequest request);
    Task<ParkingSession?> EntryAsync(EntryRequest request);
    Task<ParkingSession?> ExitAsync(ExitRequest request);
    Task<DashboardStats> GetStatsAsync();
}
