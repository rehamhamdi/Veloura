using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Veloura.Application.Commands.Cart.AddCartItem;
using Veloura.Application.Commands.Cart.RemoveCartItem;
using Veloura.Application.Commands.Cart.UpdateCartItem;
using Veloura.Application.DTOs.Cart;
using Veloura.Application.Queries.Cart.GetCart;

namespace Veloura.API.Controllers;

[ApiController]
[Route("api/cart")]
//[Authorize] // Server-side cart is for logged-in Buyers; Guests keep their cart client-side.
public class CartController : ControllerBase
{
    private readonly ISender _mediator;

    public CartController(ISender mediator)
    {
        _mediator = mediator;
    }

    //private int CurrentUserId =>
    //    int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private int CurrentUserId => 1;
    /// <summary>GET /api/cart</summary>
    [HttpGet]
    public async Task<IActionResult> GetCart(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetCartQuery(CurrentUserId), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    /// <summary>POST /api/cart/items</summary>
    [HttpPost("items")]
    public async Task<IActionResult> AddItem([FromBody] AddCartItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new AddCartItemCommand(CurrentUserId, request.ProductId, request.Quantity), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    /// <summary>PUT /api/cart/items/{cartItemId}</summary>
    [HttpPut("items/{cartItemId:int}")]
    public async Task<IActionResult> UpdateItem(int cartItemId, [FromBody] UpdateCartItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(
            new UpdateCartItemCommand(CurrentUserId, cartItemId, request.Quantity), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }

    /// <summary>DELETE /api/cart/items/{cartItemId}</summary>
    [HttpDelete("items/{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem(int cartItemId, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new RemoveCartItemCommand(CurrentUserId, cartItemId), cancellationToken);
        return StatusCode((int)response.StatusCode, response);
    }
}
