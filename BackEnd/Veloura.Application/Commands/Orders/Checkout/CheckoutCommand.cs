using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Orders.Checkout;

public record CheckoutCommand(
    int UserId,
    int ShippingAddressId,
    PaymentMethod PaymentMethod,
    string? DiscountCode
) : IRequest<Response<OrderDto>>;