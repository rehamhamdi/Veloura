namespace Veloura.Infrastructure.PaymentGateways;

public class StripeOptions
{
    public string SecretKey { get; set; } = default!;
    public string PublishableKey { get; set; } = default!;
    public string Currency { get; set; } = "usd";
}