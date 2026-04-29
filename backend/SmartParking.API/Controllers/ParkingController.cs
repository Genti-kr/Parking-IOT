using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParking.API.Models;
using SmartParking.API.Services;

namespace SmartParking.API.Controllers;

[ApiController]
[Route("api")]
public class ParkingController : ControllerBase
{
    private readonly IParkingService _parking;

    public ParkingController(IParkingService parking) => _parking = parking;

    [HttpGet("parking/available")]
    public async Task<IActionResult> GetAvailable()
        => Ok(await _parking.GetAvailableAsync());

    [HttpPost("slots/update")]
    public async Task<IActionResult> UpdateSlot([FromBody] SlotUpdateRequest request)
    {
        var ok = await _parking.UpdateSlotStatusAsync(request);
        return ok ? Ok(new { message = "Slot u perditesua" })
                  : NotFound(new { message = "Slot nuk u gjet" });
    }

    [HttpPost("entry")]
    [Authorize]
    public async Task<IActionResult> Entry([FromBody] EntryRequest request)
    {
        var session = await _parking.EntryAsync(request);
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
    [Authorize]
    public async Task<IActionResult> Stats() => Ok(await _parking.GetStatsAsync());
}
