using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Interfaces;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Orders.UpdateOrderStatus;

public class UpdateOrderStatusHandler : IRequestHandler<UpdateOrderStatusCommand, Response<OrderStatusResultDto>>
{
    // Pending -> Shipped or Canceled; Shipped -> Delivered; Delivered/Canceled are terminal.
    private static readonly Dictionary<OrderStatus, OrderStatus[]> AllowedTransitions = new()
    {
        [OrderStatus.Pending] = new[] { OrderStatus.Shipped, OrderStatus.Canceled },
        [OrderStatus.Shipped] = new[] { OrderStatus.Delivered },
        [OrderStatus.Delivered] = Array.Empty<OrderStatus>(),
        [OrderStatus.Canceled] = Array.Empty<OrderStatus>()
    };

    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public UpdateOrderStatusHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<OrderStatusResultDto>> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId, cancellationToken);

        if (order is null)
            return _responseHandler.NotFound<OrderStatusResultDto>("Order not found.");

        if (order.Status == request.NewStatus)
            return _responseHandler.BadRequest<OrderStatusResultDto>($"Order is already '{order.Status}'.");

        if (!AllowedTransitions[order.Status].Contains(request.NewStatus))
            return _responseHandler.BadRequest<OrderStatusResultDto>(
                $"Cannot move an order from '{order.Status}' to '{request.NewStatus}'.");

        // If an admin cancels a still-pending order, restock it (mirrors buyer-initiated cancellation).
        if (request.NewStatus == OrderStatus.Canceled)
        {
            foreach (var item in order.OrderItems)
                item.Product.Stock += item.Quantity;
        }

        order.Status = request.NewStatus;
        await _context.SaveChangesAsync(cancellationToken);

        var dto = new OrderStatusResultDto { Id = order.Id, Status = order.Status, UpdatedAt = order.UpdatedAt };
        return _responseHandler.Success(dto, "Order status updated successfully");
    }
}
