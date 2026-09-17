using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Orders.GetOrderById;

public class GetOrderByIdHandler : IRequestHandler<GetOrderByIdQuery, Response<OrderDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetOrderByIdHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<OrderDto>> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Orders
            .Include(o => o.ShippingAddress)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.Id == request.OrderId);

        if (!request.IsAdmin)
            query = query.Where(o => o.UserId == request.UserId);

        var order = await query.FirstOrDefaultAsync(cancellationToken);

        if (order is null)
            return _responseHandler.NotFound<OrderDto>("Order not found");

        var dto = new OrderDto
        {
            Id = order.Id,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            Total = order.Total,
            ShippingAddress = new AddressDto
            {
                Label = order.ShippingAddress.Label,
                Street = order.ShippingAddress.Street,
                City = order.ShippingAddress.City,
                State = order.ShippingAddress.State,
                PostalCode = order.ShippingAddress.PostalCode,
                Country = order.ShippingAddress.Country
            },
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductTitle = oi.Product.Title,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList(),
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };

        return _responseHandler.Success(dto);
    }
}
