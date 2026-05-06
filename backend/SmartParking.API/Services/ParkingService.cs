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

    public async Task<IEnumerable<ParkingSlot>> GetSlotsAsync(string? status = null)
    {
        var query = _db.ParkingSlots
            .Where(s => s.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalizedStatus = NormalizeStatus(status);
            query = query.Where(s => s.Status == normalizedStatus);
        }

        return await query
            .OrderBy(s => s.SlotNumber)
            .ToListAsync();
    }

    public async Task<IEnumerable<ParkingSlot>> GetAvailableAsync()
    {
        return await _db.ParkingSlots
            .Where(s => s.IsActive && s.Status == "Free")
            .OrderBy(s => s.SlotNumber)
            .ToListAsync();
    }

    public async Task<IEnumerable<AvailableSlotDto>> GetAvailableDetailedAsync()
    {
        return await _db.ParkingSlots
            .Where(s => s.IsActive && s.Status == "Free")
            .Join(
                _db.Zones,
                slot => slot.ZoneId,
                zone => zone.ZoneId,
                (slot, zone) => new AvailableSlotDto(
                    slot.SlotId,
                    slot.SlotNumber,
                    slot.ZoneId,
                    zone.Name,
                    zone.HourlyRate,
                    slot.Status))
            .OrderBy(s => s.ZoneId)
            .ThenBy(s => s.SlotNumber)
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

    public async Task<ParkingSession?> EntryAsync(EntryRequest request)
    {
        var slot = await _db.ParkingSlots.FindAsync(request.SlotId);
        if (slot is null || slot.Status is "Occupied" or "OutOfService") return null;

        // If an active reservation exists for this slot, only the reservation owner can enter.
        var activeReservation = await _db.Reservations
            .Where(r => r.SlotId == request.SlotId && (r.Status == "Confirmed" || r.Status == "Pending"))
            .OrderBy(r => r.StartTime)
            .FirstOrDefaultAsync();
        if (activeReservation is not null && request.UserId != activeReservation.UserId) return null;

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
            UserId = request.UserId,
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
            Status = "Pending"
        });

        await _db.SaveChangesAsync();
        return session;
    }

    public async Task<IEnumerable<ReservationDto>> GetReservationsAsync(string? status = null)
    {
        var query = _db.Reservations.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalizedStatus = NormalizeReservationStatus(status);
            query = query.Where(r => r.Status == normalizedStatus);
        }

        return await query
            .OrderByDescending(r => r.StartTime)
            .Select(r => new ReservationDto(
                r.ReservationId,
                r.UserId,
                r.SlotId,
                r.VehicleId,
                r.StartTime,
                r.EndTime,
                r.Status))
            .ToListAsync();
    }

    public async Task<IEnumerable<ReservationDto>> GetReservationsForUserAsync(int userId, string? status = null)
    {
        var query = _db.Reservations
            .Where(r => r.UserId == userId)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            var normalizedStatus = NormalizeReservationStatus(status);
            query = query.Where(r => r.Status == normalizedStatus);
        }

        return await query
            .OrderByDescending(r => r.StartTime)
            .Select(r => new ReservationDto(
                r.ReservationId,
                r.UserId,
                r.SlotId,
                r.VehicleId,
                r.StartTime,
                r.EndTime,
                r.Status))
            .ToListAsync();
    }

    public async Task<ReservationDto?> CreateReservationAsync(ReservationCreateRequest request)
    {
        if (request.EndTime <= request.StartTime) return null;

        var slot = await _db.ParkingSlots.FindAsync(request.SlotId);
        if (slot is null || !slot.IsActive || slot.Status is "Occupied" or "OutOfService") return null;

        var hasOverlap = await _db.Reservations.AnyAsync(r =>
            r.SlotId == request.SlotId &&
            (r.Status == "Pending" || r.Status == "Confirmed") &&
            request.StartTime < r.EndTime &&
            request.EndTime > r.StartTime);

        if (hasOverlap) return null;

        var reservation = new Reservation
        {
            UserId = request.UserId,
            SlotId = request.SlotId,
            VehicleId = request.VehicleId,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Status = "Pending"
        };

        _db.Reservations.Add(reservation);
        if (slot.Status == "Free")
        {
            slot.Status = "Reserved";
            slot.LastUpdate = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return new ReservationDto(
            reservation.ReservationId,
            reservation.UserId,
            reservation.SlotId,
            reservation.VehicleId,
            reservation.StartTime,
            reservation.EndTime,
            reservation.Status);
    }

    public async Task<ReservationDto?> UpdateReservationStatusAsync(int reservationId, string status)
    {
        var reservation = await _db.Reservations.FindAsync(reservationId);
        if (reservation is null) return null;

        reservation.Status = NormalizeReservationStatus(status);

        var slot = await _db.ParkingSlots.FindAsync(reservation.SlotId);
        if (slot is not null)
        {
            if (reservation.Status is "Cancelled" or "Completed")
            {
                if (slot.Status != "Occupied")
                {
                    slot.Status = "Free";
                    slot.LastUpdate = DateTime.UtcNow;
                }
            }
            else if (reservation.Status is "Pending" or "Confirmed")
            {
                if (slot.Status == "Free")
                {
                    slot.Status = "Reserved";
                    slot.LastUpdate = DateTime.UtcNow;
                }
            }
        }

        await _db.SaveChangesAsync();

        return new ReservationDto(
            reservation.ReservationId,
            reservation.UserId,
            reservation.SlotId,
            reservation.VehicleId,
            reservation.StartTime,
            reservation.EndTime,
            reservation.Status);
    }

    public async Task<DashboardStats> GetStatsAsync()
    {
        var total = await _db.ParkingSlots.CountAsync(s => s.IsActive);
        var free = await _db.ParkingSlots.CountAsync(s => s.IsActive && s.Status == "Free");
        var occupied = await _db.ParkingSlots.CountAsync(s => s.IsActive && s.Status == "Occupied");
        var active = await _db.ParkingSessions.CountAsync(s => s.Status == "Active");
        var pendingReservations = await _db.Reservations.CountAsync(r => r.Status == "Pending");

        var today = DateTime.UtcNow.Date;
        var revenue = await _db.Payments
            .Where(p => p.Status == "Paid" && p.PaidAt != null && p.PaidAt >= today)
            .SumAsync(p => (decimal?)p.Amount) ?? 0;
        var reservationsToday = await _db.Reservations.CountAsync(r => r.StartTime >= today);

        return new DashboardStats(total, free, occupied, active, revenue, pendingReservations, reservationsToday);
    }

    public async Task<IEnumerable<VehicleDto>> GetVehiclesForUserAsync(int userId)
    {
        return await _db.Vehicles
            .Where(v => v.UserId == userId)
            .OrderBy(v => v.VehicleId)
            .Select(v => new VehicleDto(
                v.VehicleId,
                v.UserId,
                v.PlateNumber,
                v.Brand,
                v.Model))
            .ToListAsync();
    }

    public async Task<VehicleDto?> CreateVehicleAsync(int userId, VehicleUpsertRequest request)
    {
        var normalizedPlate = request.PlateNumber.Trim().ToUpperInvariant();
        if (string.IsNullOrWhiteSpace(normalizedPlate))
        {
            return null;
        }

        var exists = await _db.Vehicles.AnyAsync(v => v.PlateNumber == normalizedPlate);
        if (exists)
        {
            return null;
        }

        var vehicle = new Vehicle
        {
            UserId = userId,
            PlateNumber = normalizedPlate,
            Brand = request.Brand?.Trim(),
            Model = request.Model?.Trim()
        };

        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync();

        return new VehicleDto(
            vehicle.VehicleId,
            vehicle.UserId,
            vehicle.PlateNumber,
            vehicle.Brand,
            vehicle.Model);
    }

    public async Task<VehicleDto?> UpdateVehicleAsync(int vehicleId, int userId, VehicleUpsertRequest request)
    {
        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.VehicleId == vehicleId && v.UserId == userId);
        if (vehicle is null)
        {
            return null;
        }

        var normalizedPlate = request.PlateNumber.Trim().ToUpperInvariant();
        if (string.IsNullOrWhiteSpace(normalizedPlate))
        {
            return null;
        }

        var duplicatePlate = await _db.Vehicles.AnyAsync(v =>
            v.VehicleId != vehicleId && v.PlateNumber == normalizedPlate);
        if (duplicatePlate)
        {
            return null;
        }

        vehicle.PlateNumber = normalizedPlate;
        vehicle.Brand = request.Brand?.Trim();
        vehicle.Model = request.Model?.Trim();

        await _db.SaveChangesAsync();

        return new VehicleDto(
            vehicle.VehicleId,
            vehicle.UserId,
            vehicle.PlateNumber,
            vehicle.Brand,
            vehicle.Model);
    }

    public async Task<bool> DeleteVehicleAsync(int vehicleId, int userId)
    {
        var vehicle = await _db.Vehicles.FirstOrDefaultAsync(v => v.VehicleId == vehicleId && v.UserId == userId);
        if (vehicle is null)
        {
            return false;
        }

        _db.Vehicles.Remove(vehicle);
        await _db.SaveChangesAsync();
        return true;
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

    private static string NormalizeReservationStatus(string status)
    {
        return status.ToLowerInvariant() switch
        {
            "pending" => "Pending",
            "confirmed" => "Confirmed",
            "active" => "Active",
            "completed" => "Completed",
            "cancelled" => "Cancelled",
            "canceled" => "Cancelled",
            _ => "Pending"
        };
    }
}
