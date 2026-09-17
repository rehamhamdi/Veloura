using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.DTOs;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Domain.Enums;
using AddressDto = Veloura.Application.DTOs.Orders.AddressDto;

namespace Veloura.Application.Commands.Orders.Checkout;

public class CheckoutHandler : IRequestHandler<CheckoutCommand, Response<OrderDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public CheckoutHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<OrderDto>> Handle(CheckoutCommand request, CancellationToken cancellationToken)
    {
        var address = await _context.Addresses
            .FirstOrDefaultAsync(a => a.Id == request.ShippingAddressId && a.UserId == request.UserId, cancellationToken);

        if (address is null)
            return _responseHandler.BadRequest<OrderDto>("Shipping address not found for this account.");

        var cartItems = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == request.UserId)
            .ToListAsync(cancellationToken);

        if (cartItems.Count == 0)
            return _responseHandler.UnprocessableEntity<OrderDto>("Your cart is empty.");

        foreach (var item in cartItems)
        {
            if (item.Quantity > item.Product.Stock)
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    $"Only {item.Product.Stock} unit(s) of '{item.Product.Title}' left in stock.");
        }

        var order = new Order
        {
            UserId = request.UserId,
            ShippingAddressId = request.ShippingAddressId,
            PaymentMethod = request.PaymentMethod,
            Status = OrderStatus.Pending,
            Total = cartItems.Sum(c => c.Product.Price * c.Quantity)
        };

        foreach (var item in cartItems)
        {
            order.OrderItems.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Product.Price
            });

            // Reserve stock for the order.
            item.Product.Stock -= item.Quantity;
        }

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync(cancellationToken);

        var dto = new OrderDto
        {
            Id = order.Id,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            Total = order.Total,
            ShippingAddress = new AddressDto
            {
                Label = address.Label,
                Street = address.Street,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country
            },
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductTitle = cartItems.First(c => c.ProductId == oi.ProductId).Product.Title,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList(),
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };

        return _responseHandler.Created(dto, "Order placed successfully");
    }
}
