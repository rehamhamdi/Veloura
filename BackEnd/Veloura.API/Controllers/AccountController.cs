using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Veloura.Application.Common.Wrappers;
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
    private readonly ResponseHandler _responseHandler;

    public AccountController(
        ISender sender,
        ResponseHandler responseHandler)
    {
        _sender = sender;
        _responseHandler = responseHandler;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        // Reuses the existing Auth.GetMe query/handler intentionally -
        // GetProfile and GetMe return the same UserDto for the same user.
        var result = await _sender.Send(new GetMeQuery(CurrentUserId), ct);

        var response = _responseHandler.Success(
            result,
            "User retrieved successfully.");

        return Ok(response);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(
        UpdateProfileRequest request,
        CancellationToken ct)
    {
        var command = new UpdateProfileCommand(
            CurrentUserId,
            request.Name,
            request.Email,
            request.CurrentPassword,
            request.NewPassword);

        var result = await _sender.Send(command, ct);

        var response = _responseHandler.Success(
            result,
            "Profile updated successfully.");

        return Ok(response);
    }

    [HttpPost("addresses")]
    public async Task<IActionResult> AddAddress(
        AddAddressRequest request,
        CancellationToken ct)
    {
        var command = new AddAddressCommand(
            CurrentUserId,
            request.Label,
            request.Street,
            request.City,
            request.State,
            request.PostalCode,
            request.Country,
            request.IsDefault);

        var result = await _sender.Send(command, ct);

        var response = _responseHandler.Created(
            result,
            "Address added successfully.");

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet("addresses")]
    public async Task<IActionResult> GetAddresses(CancellationToken ct)
    {
        var result = await _sender.Send(
            new GetAddressesQuery(CurrentUserId),
            ct);

        var response = _responseHandler.Success(
            result,
            "Addresses retrieved successfully.");

        return Ok(response);
    }

    [HttpPut("addresses/{id}")]
    public async Task<IActionResult> UpdateAddress(
        int id,
        UpdateAddressRequest request,
        CancellationToken ct)
    {
        var command = new UpdateAddressCommand(
            CurrentUserId,
            id,
            request.Label,
            request.Street,
            request.City,
            request.State,
            request.PostalCode,
            request.Country,
            request.IsDefault);

        var result = await _sender.Send(command, ct);

        var response = _responseHandler.Success(
            result,
            "Address updated successfully.");

        return Ok(response);
    }

    [HttpDelete("addresses/{id}")]
    public async Task<IActionResult> DeleteAddress(
        int id,
        CancellationToken ct)
    {
        await _sender.Send(
            new DeleteAddressCommand(CurrentUserId, id),
            ct);

        var response = _responseHandler.Deleted<object?>(
            "Address deleted successfully.");

        return Ok(response);
    }
}

// Request-only models (no UserId property) so a client can never supply or
// override the owning user id via the request body - it is always taken from
// the authenticated user's JWT claim (CurrentUserId) instead.
public record UpdateProfileRequest(
    string Name,
    string Email,
    string? CurrentPassword,
    string? NewPassword);

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