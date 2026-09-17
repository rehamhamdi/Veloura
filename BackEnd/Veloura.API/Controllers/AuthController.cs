using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.Features.Auth.GetMe;
using Veloura.Application.Features.Auth.Login;
using Veloura.Application.Features.Auth.Register;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ResponseHandler _responseHandler;

    public AuthController(
        ISender sender,
        ResponseHandler responseHandler)
    {
        _sender = sender;
        _responseHandler = responseHandler;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterUserCommand command,
        CancellationToken ct)
    {
        var user = await _sender.Send(command, ct);

        var response = _responseHandler.Created(
            user,
            "User registered successfully.");

        return CreatedAtAction(nameof(GetMe), response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginCommand command,
        CancellationToken ct)
    {
        var result = await _sender.Send(command, ct);

        var response = _responseHandler.Success(
            result,
            "Login successful.");

        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe(CancellationToken ct)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _sender.Send(
            new GetMeQuery(userId),
            ct);

        var response = _responseHandler.Success(
            result,
            "User retrieved successfully.");

        return Ok(response);
    }
}