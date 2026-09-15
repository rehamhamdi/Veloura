using MediatR;
using Veloura.Application.Common.Wrappers;

namespace Veloura.Application.Commands.Cart.RemoveCartItem;

public record RemoveCartItemCommand(int UserId, int CartItemId) : IRequest<Response<object>>;
