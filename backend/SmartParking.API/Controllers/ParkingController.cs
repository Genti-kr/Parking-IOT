using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using SmartParking.API.Models;
using SmartParking.API.Services;

namespace SmartParking.API.Controllers;

[ApiController]
[Route("api")]
public class ParkingController : ControllerBase
{
    private readonly IParkingService _parking;
    private readonly IConfiguration _config;

    public ParkingController(IParkingService parking, IConfiguration config)
    {
        _parking = parking;
        _config = config;
    }

    [HttpGet("parking/available")]
    public async Task<IActionResult> GetAvailable()
        => Ok(await _parking.GetAvailableAsync());

    [HttpGet("reservations")]
    [Authorize]
    public async Task<IActionResult> GetReservations()
        => Ok(await _parking.GetReservationsAsync(GetCurrentUserId(), IsPrivilegedUser()));

    [HttpPost("slots/update")]
    public async Task<IActionResult> UpdateSlot(
        [FromBody] SlotUpdateRequest request,
        [FromHeader(Name = "X-Device-Key")] string? deviceKey)
    {
        var expectedKey = _config["Iot:DeviceApiKey"];
        if (string.IsNullOrWhiteSpace(expectedKey))
        {
            return StatusCode(500, new { message = "Iot:DeviceApiKey nuk eshte konfiguruar" });
        }

        if (!HasMatchingDeviceKey(expectedKey, deviceKey))
        {
            return Unauthorized(new { message = "Device key i pavlefshem" });
        }

        var ok = await _parking.UpdateSlotStatusAsync(request);
        return ok ? Ok(new { message = "Slot u perditesua" })
                  : NotFound(new { message = "Slot nuk u gjet" });
    }

    [HttpPost("entry")]
    [Authorize]
    public async Task<IActionResult> Entry([FromBody] EntryRequest request)
    {
        var session = await _parking.EntryAsync(
            request,
            IsPrivilegedUser() ? request.UserId : GetCurrentUserId());
        return session is null ? BadRequest(new { message = "Slot i pavlefshem ose i zene" })
                               : Ok(session);
    }

    [HttpPost("exit")]
    [Authorize]
    public async Task<IActionResult> Exit([FromBody] ExitRequest request)
    {
        var session = await _parking.ExitAsync(request);
        return session is null ? NotFound(new { message = "Sesion i pavlefshem" })
                               : Ok(session);
    }

    [HttpGet("dashboard/stats")]
    [Authorize(Roles = "Admin,Operator")]
    public async Task<IActionResult> Stats() => Ok(await _parking.GetStatsAsync());

    private int? GetCurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }

    private bool IsPrivilegedUser()
        => User.IsInRole("Admin") || User.IsInRole("Operator");

    private static bool HasMatchingDeviceKey(string expectedKey, string? actualKey)
    {
        if (string.IsNullOrWhiteSpace(actualKey))
        {
            return false;
        }

        var expectedBytes = Encoding.UTF8.GetBytes(expectedKey);
        var actualBytes = Encoding.UTF8.GetBytes(actualKey);

        return expectedBytes.Length == actualBytes.Length &&
               CryptographicOperations.FixedTimeEquals(expectedBytes, actualBytes);
    }
}
