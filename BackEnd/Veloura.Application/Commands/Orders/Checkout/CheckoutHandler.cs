using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Application.DTOs.Payments;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Domain.Enums;
using AddressDto = Veloura.Application.DTOs.Orders.AddressDto;

namespace Veloura.Application.Commands.Orders.Checkout;

public class CheckoutHandler : IRequestHandler<CheckoutCommand, Response<OrderDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;
    private readonly IPaymentService _paymentService;

    public CheckoutHandler(IAppDbContext context, ResponseHandler responseHandler, IPaymentService paymentService)
    {
        _context = context;
        _responseHandler = responseHandler;
        _paymentService = paymentService;
    }

    public async Task<Response<OrderDto>> Handle(
        CheckoutCommand request,
        CancellationToken cancellationToken)
    {
        var address = await _context.Addresses
            .FirstOrDefaultAsync(
                a => a.Id == request.ShippingAddressId &&
                     a.UserId == request.UserId,
                cancellationToken);

        if (address is null)
            return _responseHandler.BadRequest<OrderDto>(
                "Shipping address not found for this account.");

        var cartItems = await _context.CartItems
            .Include(c => c.Product)
            .Where(c => c.UserId == request.UserId)
            .ToListAsync(cancellationToken);

        if (cartItems.Count == 0)
            return _responseHandler.UnprocessableEntity<OrderDto>(
                "Your cart is empty.");

        foreach (var item in cartItems)
        {
            if (item.Quantity > item.Product.Stock)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    $"Only {item.Product.Stock} unit(s) of '{item.Product.Title}' left in stock.");
            }
        }

        // Calculate the order subtotal before applying any discount.
        var subtotal = cartItems.Sum(
            c => c.Product.Price * c.Quantity);

        decimal discountAmount = 0;
        string? appliedDiscountCode = null;
        Discount? discount = null;

        // Apply discount only when a code was provided.
        if (!string.IsNullOrWhiteSpace(request.DiscountCode))
        {
            var normalizedCode = request.DiscountCode.Trim().ToUpperInvariant();

            discount = await _context.Discounts
                .FirstOrDefaultAsync(
                    d => d.Code == normalizedCode,
                    cancellationToken);

            if (discount is null)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    "Invalid discount code.");
            }

            var now = DateTime.UtcNow;

            if (!discount.IsActive)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    "This discount code is inactive.");
            }

            if (now < discount.StartsAt)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    "This discount code is not active yet.");
            }

            if (discount.ExpiresAt.HasValue &&
                now > discount.ExpiresAt.Value)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    "This discount code has expired.");
            }

            if (discount.MaxUses.HasValue &&
                discount.UsedCount >= discount.MaxUses.Value)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    "This discount code has reached its maximum usage limit.");
            }

            var alreadyUsed = await _context.DiscountUsages
                .AnyAsync(
                    du => du.DiscountId == discount.Id &&
                          du.UserId == request.UserId,
                    cancellationToken);

            if (alreadyUsed)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    "You have already used this discount code.");
            }

            if (discount.MinimumOrderAmount.HasValue &&
                subtotal < discount.MinimumOrderAmount.Value)
            {
                return _responseHandler.UnprocessableEntity<OrderDto>(
                    $"This discount requires a minimum order amount of {discount.MinimumOrderAmount.Value:0.00}.");
            }

            discountAmount = discount.Type switch
            {
                DiscountType.Percentage =>
                    subtotal * (discount.Value / 100m),

                DiscountType.FixedAmount =>
                    Math.Min(discount.Value, subtotal),

                _ => 0
            };

            appliedDiscountCode = discount.Code;
        }

        var total = subtotal - discountAmount;

        var order = new Order
        {
            UserId = request.UserId,
            ShippingAddressId = request.ShippingAddressId,
            PaymentMethod = request.PaymentMethod,
            Status = OrderStatus.Pending,

            Subtotal = subtotal,
            DiscountCode = appliedDiscountCode,
            DiscountAmount = discountAmount,
            Total = total
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

if (discount is not null)
{
    discount.UsedCount++;

    _context.DiscountUsages.Add(new DiscountUsage
    {
        DiscountId = discount.Id,
        UserId = request.UserId,
        Order = order,
        UsedAt = DateTime.UtcNow
    });
}

        _context.CartItems.RemoveRange(cartItems);

        await _context.SaveChangesAsync(cancellationToken);
        var payment = await _paymentService.CreatePaymentAsync(
                         order.Id,
                         order.Total,
                         request.PaymentMethod);


        var dto = new OrderDto
        {
            Id = order.Id,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,

            Subtotal = order.Subtotal,
            DiscountCode = order.DiscountCode,
            DiscountAmount = order.DiscountAmount,

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

            Payment = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status,
                Amount = payment.Amount,
                TransactionId = payment.TransactionId,
                ProviderReference = payment.ProviderReference,
                CreatedAt = payment.CreatedAt,
                PaidAt = payment.PaidAt
            },

            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductTitle = cartItems
                    .First(c => c.ProductId == oi.ProductId)
                    .Product.Title,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList(),

            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };

        return _responseHandler.Created(
            dto,
            "Order placed successfully.");
    }
}