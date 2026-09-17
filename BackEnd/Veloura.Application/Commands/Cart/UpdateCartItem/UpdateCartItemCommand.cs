using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs;
using Veloura.Application.DTOs.Cart;

namespace Veloura.Application.Commands.Cart.UpdateCartItem;

public record UpdateCartItemCommand(int UserId, int CartItemId, int Quantity) : IRequest<Response<CartItemDto>>;
