using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Orders;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Orders.Checkout;

public record CheckoutCommand(
    int UserId,
    int ShippingAddressId,
    PaymentMethod PaymentMethod,
    string? DiscountCode,
    string? PaymentToken // Required when PaymentMethod != CashOnDelivery; this is the Stripe PaymentMethodId (pm_...)
) : IRequest<Response<OrderDto>>;