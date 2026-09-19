using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Commands.Discounts.CreateDiscount;
using Veloura.Application.Commands.Discounts.UpdateDiscountStatus;
using Veloura.Application.Queries.Discounts.GetAllDiscounts;
using Veloura.Application.Queries.Discounts.GetDiscountUsages;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/admin/discounts")]
[Authorize(Roles = "Admin")]
public class AdminDiscountsController : ControllerBase
{
    private readonly ISender _mediator;

    public AdminDiscountsController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateDiscountCommand command,
        CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(command, cancellationToken);

        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new GetAllDiscountsQuery(),
            cancellationToken);

        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("{discountId:int}/usages")]
    public async Task<IActionResult> GetUsages(
        int discountId,
        CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new GetDiscountUsagesQuery(discountId),
            cancellationToken);

        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateDiscountStatusCommand command,
        CancellationToken cancellationToken)
    {
        var request = command with { DiscountId = id };

        var response = await _mediator.Send(
            request,
            cancellationToken);

        return StatusCode((int)response.StatusCode, response);
    }
}