using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
<<<<<<< HEAD
=======
using System.Security.Claims;
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
using SmartParking.API.Models;
using SmartParking.API.Services;

namespace SmartParking.API.Controllers;

[ApiController]
[Route("api")]
public class ParkingController : ControllerBase
{
    private readonly IParkingService _parking;

    public ParkingController(IParkingService parking) => _parking = parking;

    [HttpGet("parking/slots")]
    public async Task<IActionResult> GetSlots([FromQuery] string? status)
        => Ok(await _parking.GetSlotsAsync(status));

    [HttpGet("parking/available")]
    public async Task<IActionResult> GetAvailable()
        => Ok(await _parking.GetAvailableAsync());

<<<<<<< HEAD
=======
    [HttpGet("parking/available-detailed")]
    [Authorize]
    public async Task<IActionResult> GetAvailableDetailed()
        => Ok(await _parking.GetAvailableDetailedAsync());

>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
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
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Stats() => Ok(await _parking.GetStatsAsync());

    [HttpGet("reservations")]
    [Authorize]
    public async Task<IActionResult> GetReservations([FromQuery] string? status)
<<<<<<< HEAD
        => Ok(await _parking.GetReservationsAsync(status));
=======
    {
        if (User.IsInRole(RoleNames.Admin))
        {
            return Ok(await _parking.GetReservationsAsync(status));
        }

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User claim is invalid." });
        }

        return Ok(await _parking.GetReservationsForUserAsync(userId, status));
    }
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)

    [HttpPost("reservations")]
    [Authorize]
    public async Task<IActionResult> CreateReservation([FromBody] ReservationCreateRequest request)
    {
<<<<<<< HEAD
        var result = await _parking.CreateReservationAsync(request);
=======
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User claim is invalid." });
        }

        var requestWithAuthenticatedUser = new ReservationCreateRequest(
            userId,
            request.SlotId,
            request.VehicleId,
            request.StartTime,
            request.EndTime);

        var result = await _parking.CreateReservationAsync(requestWithAuthenticatedUser);
>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
        return result is null
            ? BadRequest(new { message = "Rezervimi deshtoi: orari ose vendi nuk eshte valid." })
            : Ok(result);
    }

    [HttpPatch("reservations/{id:int}/status")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] ReservationStatusUpdateRequest request)
    {
        var result = await _parking.UpdateReservationStatusAsync(id, request.Status);
        return result is null
            ? NotFound(new { message = "Rezervimi nuk u gjet." })
            : Ok(result);
    }
<<<<<<< HEAD
=======

    [HttpGet("vehicles")]
    [Authorize]
    public async Task<IActionResult> GetVehicles()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User claim is invalid." });
        }

        return Ok(await _parking.GetVehiclesForUserAsync(userId));
    }

    [HttpPost("vehicles")]
    [Authorize]
    public async Task<IActionResult> CreateVehicle([FromBody] VehicleUpsertRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User claim is invalid." });
        }

        var result = await _parking.CreateVehicleAsync(userId, request);
        return result is null
            ? BadRequest(new { message = "Vehicle could not be created. Check plate number uniqueness." })
            : Ok(result);
    }

    [HttpPut("vehicles/{id:int}")]
    [Authorize]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] VehicleUpsertRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User claim is invalid." });
        }

        var result = await _parking.UpdateVehicleAsync(id, userId, request);
        return result is null
            ? BadRequest(new { message = "Vehicle could not be updated." })
            : Ok(result);
    }

    [HttpDelete("vehicles/{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { message = "User claim is invalid." });
        }

        var deleted = await _parking.DeleteVehicleAsync(id, userId);
        return deleted
            ? Ok(new { message = "Vehicle deleted." })
            : NotFound(new { message = "Vehicle not found." });
    }

>>>>>>> 7b27dd1 (Improved user dashboard, vehicles, and reservations layout and navigation)
}
