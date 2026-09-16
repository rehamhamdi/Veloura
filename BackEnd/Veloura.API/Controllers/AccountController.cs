using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Veloura.Application.Features.Account.AddAddress;
using Veloura.Application.Features.Account.DeleteAddress;
using Veloura.Application.Features.Account.GetAddresses;
using Veloura.Application.Features.Account.UpdateAddress;
using Veloura.Application.Features.Account.UpdateProfile;
using Veloura.Application.Features.Auth.GetMe;

namespace Veloura.API.Controllers;

[Authorize]
[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly ISender _sender;
    public AccountController(ISender sender) => _sender = sender;

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        // Reuses the existing Auth.GetMe query/handler intentionally -
        // GetProfile and GetMe return the same UserDto for the same user.
        var result = await _sender.Send(new GetMeQuery(CurrentUserId), ct);
        return Ok(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request, CancellationToken ct)
    {
        var command = new UpdateProfileCommand(CurrentUserId, request.Name, request.Email);
        var result = await _sender.Send(command, ct);
        return Ok(result);
    }

    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress(AddAddressRequest request, CancellationToken ct)
    {
        var command = new AddAddressCommand(
            CurrentUserId, request.Label, request.Street, request.City,
            request.State, request.PostalCode, request.Country, request.IsDefault);
        var result = await _sender.Send(command, ct);
        return StatusCode(StatusCodes.Status201Created, result);
    }

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses(CancellationToken ct)
    {
        var result = await _sender.Send(new GetAddressesQuery(CurrentUserId), ct);
        return Ok(result);
    }

    [HttpPut("addresses/{id}")]
    public async Task<IActionResult> UpdateAddress(int id, UpdateAddressRequest request, CancellationToken ct)
    {
        var command = new UpdateAddressCommand(
            CurrentUserId, id, request.Label, request.Street, request.City,
            request.State, request.PostalCode, request.Country, request.IsDefault);
        var result = await _sender.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("addresses/{id}")]
    public async Task<IActionResult> DeleteAddress(int id, CancellationToken ct)
    {
        await _sender.Send(new DeleteAddressCommand(CurrentUserId, id), ct);
        return NoContent();
    }
}

// Request-only models (no UserId property) so a client can never supply or
// override the owning user id via the request body - it is always taken
// from the authenticated user's JWT claim (CurrentUserId) instead.
public record UpdateProfileRequest(string Name, string Email);

public record AddAddressRequest(
    string? Label,
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault);

public record UpdateAddressRequest(
    string? Label,
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country,
    bool IsDefault);