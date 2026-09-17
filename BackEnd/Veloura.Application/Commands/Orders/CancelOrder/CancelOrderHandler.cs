using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Interfaces;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Orders.CancelOrder;

public class CancelOrderHandler : IRequestHandler<CancelOrderCommand, Response<OrderStatusResultDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public CancelOrderHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<OrderStatusResultDto>> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == request.UserId, cancellationToken);

        if (order is null)
            return _responseHandler.NotFound<OrderStatusResultDto>("Order not found");

        if (order.Status != OrderStatus.Pending)
            return _responseHandler.BadRequest<OrderStatusResultDto>("Only pending orders can be cancelled");

        order.Status = OrderStatus.Canceled;

        // Restock cancelled items.
        foreach (var item in order.OrderItems)
            item.Product.Stock += item.Quantity;

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new OrderStatusResultDto { Id = order.Id, Status = order.Status, UpdatedAt = order.UpdatedAt };
        return _responseHandler.Success(dto, "Order cancelled successfully");
    }
}
