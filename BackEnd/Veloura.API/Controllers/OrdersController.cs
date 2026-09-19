using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Commands.Orders.CancelOrder;
using Veloura.Application.Commands.Orders.Checkout;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Queries.Orders.GetMyOrders;
using Veloura.Application.Queries.Orders.GetOrderById;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize(Roles = "Buyer")]
public class OrdersController : ControllerBase
{
    private readonly ISender _mediator;

    public OrdersController(ISender mediator)
    {
        _mediator = mediator;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(
    [FromBody] CheckoutRequest request,
    CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new CheckoutCommand(
                CurrentUserId,
                request.ShippingAddressId,
                request.PaymentMethod,
                request.DiscountCode),
            cancellationToken);

        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var response = await _mediator.Send(new GetMyOrdersQuery(CurrentUserId, page, pageSize), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("{orderId:int}")]
    public async Task<IActionResult> GetById(int orderId, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetOrderByIdQuery(CurrentUserId, orderId, IsAdmin: false), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("{orderId:int}/cancel")]
    public async Task<IActionResult> Cancel(int orderId, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new CancelOrderCommand(CurrentUserId, orderId), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }
}
