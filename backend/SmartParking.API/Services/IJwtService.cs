using SmartParking.API.Entities;

namespace SmartParking.API.Services;

public interface IJwtService
{
    string GenerateToken(User user, string roleName);
}
