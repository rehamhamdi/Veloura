using Microsoft.Extensions.Options;
using Stripe;
using Veloura.Application.DTOs.Payments;
using Veloura.Application.Interfaces;
using Veloura.Domain.Enums;

namespace Veloura.Infrastructure.PaymentGateways;

public class StripePaymentGateway : IPaymentGateway
{
    private readonly StripeOptions _options;

    public StripePaymentGateway(IOptions<StripeOptions> options)
    {
        _options = options.Value;
    }

    public async Task<PaymentGatewayResult> ChargeAsync(
     int orderId,
     decimal amount,
     Domain.Enums.PaymentMethod paymentMethod,
     string? paymentToken,
     CancellationToken cancellationToken)
    {
        if (paymentMethod == Domain.Enums.PaymentMethod.CashOnDelivery)
            return PaymentGatewayResult.Success("N/A", "COD");

        if (string.IsNullOrWhiteSpace(paymentToken))
            return PaymentGatewayResult.Failure("Payment method details were not provided.");

        var requestOptions = new RequestOptions { ApiKey = _options.SecretKey };
        var service = new PaymentIntentService();

        try
        {
            var createOptions = new PaymentIntentCreateOptions
            {
                Amount = ToSmallestCurrencyUnit(amount),
                Currency = _options.Currency,
                PaymentMethod = paymentToken,
                Confirm = true,
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                    AllowRedirects = "never"
                },
                Metadata = new Dictionary<string, string>
            {
                { "orderId", orderId.ToString() }
            }
            };

            var intent = await service.CreateAsync(createOptions, requestOptions, cancellationToken);

            if (intent.Status == "succeeded")
            {
                var charge = intent.LatestChargeId;
                return PaymentGatewayResult.Success(intent.Id, charge ?? intent.Id);
            }

            return PaymentGatewayResult.Failure(
                $"Payment could not be completed (status: {intent.Status}).");
        }
        catch (StripeException ex)
        {
            return PaymentGatewayResult.Failure(
                ex.StripeError?.Message ?? "Payment was declined by the payment provider.");
        }
    }
    private static long ToSmallestCurrencyUnit(decimal amount) =>
        (long)Math.Round(amount * 100, MidpointRounding.AwayFromZero);
}