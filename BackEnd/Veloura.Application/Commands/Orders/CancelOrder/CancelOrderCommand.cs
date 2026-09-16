using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;

namespace Veloura.Application.Commands.Orders.CancelOrder;

public record CancelOrderCommand(int UserId, int OrderId) : IRequest<Response<OrderStatusResultDto>>;
