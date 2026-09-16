using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Commands.Orders.UpdateOrderStatus;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Queries.Orders.GetAllOrders;
using Veloura.Application.Queries.Orders.GetOrderById;
using Veloura.Domain.Enums;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase
{
    private readonly ISender _mediator;

    public AdminOrdersController(ISender mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 15,
        [FromQuery] OrderStatus? status = null,
        [FromQuery] string? search = null,
        CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(new GetAllOrdersQuery(page, pageSize, status, search), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetById(int orderId, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetOrderByIdQuery(0, orderId, IsAdmin: true), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("{orderId:int}/status")]
    public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] UpdateOrderStatusRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new UpdateOrderStatusCommand(orderId, request.Status), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }
}
