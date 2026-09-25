using Veloura.Application.DTOs.Payments;
using Veloura.Domain.Enums;

namespace Veloura.Application.Interfaces;

public interface IPaymentGateway
{
    Task<PaymentGatewayResult> ChargeAsync(
        int orderId,
        decimal amount,
        PaymentMethod paymentMethod,
        string? paymentToken, 
        CancellationToken cancellationToken);
}