using Microsoft.EntityFrameworkCore;
using SmartParking.API.Data;
using SmartParking.API.Entities;
using SmartParking.API.Models;

namespace SmartParking.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;

    public AuthService(AppDbContext db, IJwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

        if (user is null) return null;
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) return null;

        var roleName = user.Role?.Name ?? "Guest";
        var token = _jwt.GenerateToken(user, roleName);

        return new AuthResponse(user.UserId, user.FullName, user.Email, roleName, token);
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return null;

        var guestRole = await _db.Roles.FirstOrDefaultAsync(r => r.Name == "Guest");
        if (guestRole is null) return null;

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = guestRole.RoleId
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwt.GenerateToken(user, guestRole.Name);
        return new AuthResponse(user.UserId, user.FullName, user.Email, guestRole.Name, token);
    }
}
