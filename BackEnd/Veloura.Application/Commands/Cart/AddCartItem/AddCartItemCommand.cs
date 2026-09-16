using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs;

namespace Veloura.Application.Commands.Cart.AddCartItem;

public record AddCartItemCommand(int UserId, int ProductId, int Quantity) : IRequest<Response<CartItemDto>>;
