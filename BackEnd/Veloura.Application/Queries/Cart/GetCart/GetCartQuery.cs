using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Cart;

namespace Veloura.Application.Queries.Cart.GetCart;

public record GetCartQuery(int UserId) : IRequest<Response<CartDto>>;
