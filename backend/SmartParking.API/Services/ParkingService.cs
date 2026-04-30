using Microsoft.EntityFrameworkCore;
using SmartParking.API.Data;
using SmartParking.API.Entities;
using SmartParking.API.Models;

namespace SmartParking.API.Services;

public class ParkingService : IParkingService
{
    private const decimal DefaultHourlyRate = 1.00m;

    private readonly AppDbContext _db;

    public ParkingService(AppDbContext db) => _db = db;

    public async Task<IEnumerable<ParkingSlot>> GetAvailableAsync()
    {
        return await _db.ParkingSlots
            .Where(s => s.IsActive && s.Status == "Free")
            .OrderBy(s => s.SlotNumber)
            .ToListAsync();
    }

    public async Task<IEnumerable<ReservationListItem>> GetReservationsAsync(int? userId, bool includeAll)
    {
        var reservations = _db.Reservations.AsNoTracking();

        if (!includeAll)
        {
            if (userId is null)
            {
                return Array.Empty<ReservationListItem>();
            }

            reservations = reservations.Where(r => r.UserId == userId.Value);
        }

        return await (
            from reservation in reservations
            join user in _db.Users.AsNoTracking() on reservation.UserId equals user.UserId
            join slot in _db.ParkingSlots.AsNoTracking() on reservation.SlotId equals slot.SlotId
            join vehicle in _db.Vehicles.AsNoTracking() on reservation.VehicleId equals vehicle.VehicleId into vehicleGroup
            from vehicle in vehicleGroup.DefaultIfEmpty()
            orderby reservation.StartTime descending
            select new ReservationListItem(
                reservation.ReservationId,
                user.FullName,
                vehicle != null ? vehicle.PlateNumber : null,
                slot.SlotNumber,
                reservation.StartTime,
                reservation.EndTime,
                reservation.Status))
            .ToListAsync();
    }

    public async Task<bool> UpdateSlotStatusAsync(SlotUpdateRequest request)
    {
        var slot = await _db.ParkingSlots.FindAsync(request.SlotId);
        if (slot is null) return false;

        slot.Status = NormalizeStatus(request.Status);
        slot.LastUpdate = request.Timestamp ?? DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<ParkingSession?> EntryAsync(EntryRequest request, int? effectiveUserId)
    {
        var slot = await _db.ParkingSlots.FindAsync(request.SlotId);
        if (slot is null || slot.Status == "Occupied") return null;

        int? vehicleId = null;
        if (!string.IsNullOrWhiteSpace(request.PlateNumber))
        {
            var vehicle = await _db.Vehicles
                .FirstOrDefaultAsync(v => v.PlateNumber == request.PlateNumber);
            vehicleId = vehicle?.VehicleId;
        }

        var session = new ParkingSession
        {
            SlotId = slot.SlotId,
            VehicleId = vehicleId,
            UserId = effectiveUserId,
            EntryTime = DateTime.UtcNow,
            Status = "Active"
        };

        slot.Status = "Occupied";
        slot.LastUpdate = DateTime.UtcNow;

        _db.ParkingSessions.Add(session);
        await _db.SaveChangesAsync();
        return session;
    }

    public async Task<ParkingSession?> ExitAsync(ExitRequest request)
    {
        var session = await _db.ParkingSessions.FindAsync(request.SessionId);
        if (session is null || session.Status != "Active") return null;

        session.ExitTime = DateTime.UtcNow;
        session.Status = "Completed";
        session.TotalAmount = CalculateFee(session.EntryTime, session.ExitTime.Value);

        var slot = await _db.ParkingSlots.FindAsync(session.SlotId);
        if (slot is not null)
        {
            slot.Status = "Free";
            slot.LastUpdate = DateTime.UtcNow;
        }

        _db.Payments.Add(new Payment
        {
            SessionId = session.SessionId,
            Amount = session.TotalAmount ?? 0,
            PaymentMethod = "Cash",
            Status = "Paid",
            PaidAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync();
        return session;
    }

    public async Task<DashboardStats> GetStatsAsync()
    {
        var total = await _db.ParkingSlots.CountAsync(s => s.IsActive);
        var free = await _db.ParkingSlots.CountAsync(s => s.IsActive && s.Status == "Free");
        var occupied = await _db.ParkingSlots.CountAsync(s => s.IsActive && s.Status == "Occupied");
        var active = await _db.ParkingSessions.CountAsync(s => s.Status == "Active");

        var today = DateTime.UtcNow.Date;
        var revenue = await _db.Payments
            .Where(p => p.Status == "Paid" && p.PaidAt != null && p.PaidAt >= today)
            .SumAsync(p => (decimal?)p.Amount) ?? 0;

        return new DashboardStats(total, free, occupied, active, revenue);
    }

    private static decimal CalculateFee(DateTime entry, DateTime exit)
    {
        var minutes = (decimal)(exit - entry).TotalMinutes;
        var hours = Math.Ceiling(minutes / 60m);
        return hours * DefaultHourlyRate;
    }

    private static string NormalizeStatus(string status)
    {
        return status.ToLowerInvariant() switch
        {
            "free" => "Free",
            "occupied" => "Occupied",
            "reserved" => "Reserved",
            "outofservice" => "OutOfService",
            _ => "Free"
        };
    }
}
