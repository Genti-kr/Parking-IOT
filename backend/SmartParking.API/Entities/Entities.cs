namespace SmartParking.API.Entities;

public class Role
{
    public int RoleId { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
}

public class User
{
    public int UserId { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string? PhoneNumber { get; set; }
    public string PasswordHash { get; set; } = "";
    public int RoleId { get; set; }
    public Role? Role { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Vehicle
{
    public int VehicleId { get; set; }
    public int UserId { get; set; }
    public string PlateNumber { get; set; } = "";
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Color { get; set; }
}

public class Zone
{
    public int ZoneId { get; set; }
    public string Name { get; set; } = "";
    public string? Location { get; set; }
    public int Capacity { get; set; }
    public decimal HourlyRate { get; set; }
}

public class ParkingSlot
{
    public int SlotId { get; set; }
    public int ZoneId { get; set; }
    public string SlotNumber { get; set; } = "";
    public string Status { get; set; } = "Free";
    public DateTime LastUpdate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}

public class ParkingSession
{
    public int SessionId { get; set; }
    public int SlotId { get; set; }
    public int? VehicleId { get; set; }
    public int? UserId { get; set; }
    public DateTime EntryTime { get; set; } = DateTime.UtcNow;
    public DateTime? ExitTime { get; set; }
    public decimal? TotalAmount { get; set; }
    public string Status { get; set; } = "Active";
}

public class Reservation
{
    public int ReservationId { get; set; }
    public int UserId { get; set; }
    public int SlotId { get; set; }
    public int? VehicleId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; } = "Pending";
}

public class Payment
{
    public int PaymentId { get; set; }
    public int SessionId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "Cash";
    public string Status { get; set; } = "Pending";
    public DateTime? PaidAt { get; set; }
}
