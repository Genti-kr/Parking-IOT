using Microsoft.EntityFrameworkCore;
using SmartParking.API.Entities;

namespace SmartParking.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Zone> Zones => Set<Zone>();
    public DbSet<ParkingSlot> ParkingSlots => Set<ParkingSlot>();
    public DbSet<ParkingSession> ParkingSessions => Set<ParkingSession>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(u => u.Email).IsUnique();
        b.Entity<Vehicle>().HasIndex(v => v.PlateNumber).IsUnique();

        b.Entity<ParkingSession>()
            .HasOne<Payment>()
            .WithOne()
            .HasForeignKey<Payment>(p => p.SessionId);
    }
}
