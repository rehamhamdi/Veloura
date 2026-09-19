using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Orders;

public class CheckoutRequest
{
    public int ShippingAddressId { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public string? DiscountCode { get; set; }
}