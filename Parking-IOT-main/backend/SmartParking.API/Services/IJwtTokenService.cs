using SmartParking.API.Entities;

namespace SmartParking.API.Services;

public interface IJwtTokenService
{
    string CreateToken(User user, string roleName);
}
