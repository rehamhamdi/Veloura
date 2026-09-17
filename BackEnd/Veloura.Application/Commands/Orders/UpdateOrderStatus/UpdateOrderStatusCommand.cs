using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Orders.UpdateOrderStatus;

public record UpdateOrderStatusCommand(int OrderId, OrderStatus NewStatus) : IRequest<Response<OrderStatusResultDto>>;
