using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Veloura.Application.Commands.Settings.UpdateContactInfo;
using Veloura.Application.Commands.Settings.UpdateSocialLinks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Account;
using Veloura.Application.DTOs.Settings;
using Veloura.Application.Features.Account.ChangePassword;
using Veloura.Application.Features.Account.UpdateProfile;
using Veloura.Application.Features.Auth.GetMe;
using Veloura.Application.Queries.Settings.GetSiteSettings;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin")]
public class AdminSettingsController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ResponseHandler _responseHandler;

    public AdminSettingsController(ISender sender, ResponseHandler responseHandler)
    {
        _sender = sender;
        _responseHandler = responseHandler;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("profile")]
    public async Task<ActionResult<Response<UserDto>>> GetProfile(CancellationToken ct)
    {
        var result = await _sender.Send(new GetMeQuery(CurrentUserId), ct);
        var response = _responseHandler.Success(result, "Profile retrieved successfully.");
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("profile")]
    public async Task<ActionResult<Response<UserDto>>> UpdateProfile(
        UpdateProfileRequest request,
        CancellationToken ct)
    {
        var command = new UpdateProfileCommand(
            CurrentUserId,
            request.Name,
            request.Email);

        var result = await _sender.Send(command, ct);
        var response = _responseHandler.Success(result, "Profile updated successfully.");
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("change-password")]
    
    public async Task<ActionResult<Response<object?>>> ChangePassword(
        ChangePasswordRequest request,
        CancellationToken ct)
    {
        var command = new ChangePasswordCommand(
            CurrentUserId,
            request.CurrentPassword,
            request.NewPassword,
            request.ConfirmNewPassword);

        await _sender.Send(command, ct);

        var response = _responseHandler.Success<object?>(null, "Password updated successfully.");
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("site")]
    public async Task<ActionResult<Response<SiteSettingsDto>>> GetSiteSettings(CancellationToken ct)
    {
        var response = await _sender.Send(new GetSiteSettingsQuery(), ct);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("social-links")]
    [ProducesResponseType(typeof(Response<SiteSettingsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response<SiteSettingsDto>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Response<SiteSettingsDto>>> UpdateSocialLinks(
        UpdateSocialLinksCommand command,
        CancellationToken ct)
    {
        var response = await _sender.Send(command, ct);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("contact-info")]
    public async Task<ActionResult<Response<SiteSettingsDto>>> UpdateContactInfo(
        UpdateContactInfoCommand command,
        CancellationToken ct)
    {
        var response = await _sender.Send(command, ct);
        return StatusCode((int)response.StatusCode, response);
    }
}

