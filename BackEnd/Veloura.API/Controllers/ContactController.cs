using MediatR;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.Features.Contact.SendMessage;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/contact")]
public class ContactController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ResponseHandler _responseHandler;

    public ContactController(
        ISender sender,
        ResponseHandler responseHandler)
    {
        _sender = sender;
        _responseHandler = responseHandler;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage(
        SendContactMessageRequest request,
        CancellationToken ct)
    {
        await _sender.Send(
            new SendContactMessageCommand(
                request.Name,
                request.Email,
                request.Message),
            ct);

        var response = _responseHandler.Created<object?>(
            null,
            "Message sent successfully.");

        return StatusCode(StatusCodes.Status201Created, response);
    }
}

public record SendContactMessageRequest(
    string Name,
    string Email,
    string Message);