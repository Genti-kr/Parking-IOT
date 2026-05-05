using Microsoft.EntityFrameworkCore;
using SmartParking.API.Data;
using SmartParking.API.Entities;
using SmartParking.API.Models;

namespace SmartParking.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(AppDbContext db, IJwtTokenService jwtTokenService)
    {
        _db = db;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existingUser = await _db.Users.AnyAsync(u => u.Email == normalizedEmail);
        if (existingUser)
        {
            return null;
        }

        var userRole = await GetOrCreateRoleAsync(RoleNames.User, "Standard user role");
        await GetOrCreateRoleAsync(RoleNames.Admin, "Administrator role");

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            PhoneNumber = request.PhoneNumber?.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            RoleId = userRole.RoleId,
            IsActive = true
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _jwtTokenService.CreateToken(user, userRole.Name);
        return new AuthResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            Role = userRole.Name,
            Token = token
        };
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail && u.IsActive);

        if (user is null)
        {
            return null;
        }

        var passwordIsValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!passwordIsValid)
        {
            return null;
        }

        var roleName = user.Role?.Name ?? RoleNames.User;
        var token = _jwtTokenService.CreateToken(user, roleName);

        return new AuthResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            Role = roleName,
            Token = token
        };
    }

    public async Task<IReadOnlyList<UserSummaryResponse>> GetUsersAsync()
    {
        return await _db.Users
            .AsNoTracking()
            .Include(u => u.Role)
            .OrderBy(u => u.UserId)
            .Select(u => new UserSummaryResponse
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role != null ? u.Role.Name : string.Empty,
                IsActive = u.IsActive
            })
            .ToListAsync();
    }

    private async Task<Role> GetOrCreateRoleAsync(string roleName, string description)
    {
        var role = await _db.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
        if (role is not null)
        {
            return role;
        }

        role = new Role
        {
            Name = roleName,
            Description = description
        };

        _db.Roles.Add(role);
        await _db.SaveChangesAsync();
        return role;
    }
}
