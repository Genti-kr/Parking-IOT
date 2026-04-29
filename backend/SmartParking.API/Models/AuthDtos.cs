namespace SmartParking.API.Models;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(
    string FullName,
    string Email,
    string Password,
    string? PhoneNumber);

public record AuthResponse(
    int UserId,
    string FullName,
    string Email,
    string Role,
    string Token);
