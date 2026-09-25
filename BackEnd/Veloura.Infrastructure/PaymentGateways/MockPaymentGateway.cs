using Veloura.Application.DTOs.Payments;
using Veloura.Application.Interfaces;
using Veloura.Domain.Enums;

namespace Veloura.Infrastructure.PaymentGateways;

//// Local mock for testing without Stripe keys - automatically enabled when Stripe:SecretKey is empty.
public class MockPaymentGateway : IPaymentGateway
{
    public async Task<PaymentGatewayResult> ChargeAsync(
        int orderId,
        decimal amount,
        PaymentMethod paymentMethod,
        string? paymentToken,
        CancellationToken cancellationToken)
    {
        if (paymentMethod == PaymentMethod.CashOnDelivery)
            return PaymentGatewayResult.Success("N/A", "COD");

        await Task.Delay(300, cancellationToken);

        if (amount <= 0)
            return PaymentGatewayResult.Failure("Invalid payment amount.");

        var cents = (int)Math.Round((amount - Math.Floor(amount)) * 100);
        if (cents == 13)
        {
            return PaymentGatewayResult.Failure(
                "Payment was declined by the payment provider. Please try a different payment method.");
        }

        var transactionId = $"TXN-{Guid.NewGuid():N}"[..20];
        var providerReference = $"{paymentMethod}-{orderId}-{DateTime.UtcNow.Ticks}";

        return PaymentGatewayResult.Success(transactionId, providerReference);
    }
}