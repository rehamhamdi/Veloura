using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Queries.Contact.GetMessages;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/admin/contact")]
[Authorize(Roles = "Admin")]
public class AdminContactController : ControllerBase
{
    private readonly ISender _mediator;

    public AdminContactController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages(
        CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new GetContactMessagesQuery(),
            cancellationToken);

        return StatusCode(
            (int)response.StatusCode,
            response);
    }
}