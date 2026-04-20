using Microsoft.AspNetCore.Mvc;
using SmartParking.API.Models;
using SmartParking.API.Services;

namespace SmartParking.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);
        if (result is null) return Unauthorized(new { message = "Email ose password i pasakte" });
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await _auth.RegisterAsync(request);
        if (result is null) return BadRequest(new { message = "Emaili eshte ne perdorim" });
        return Ok(result);
    }
}
