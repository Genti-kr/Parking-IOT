using SmartParking.API.Models;

namespace SmartParking.API.Services;

public interface IAuthService
{
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<IReadOnlyList<UserSummaryResponse>> GetUsersAsync();
}
