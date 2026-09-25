namespace Veloura.Application.DTOs.Payments;

public class PaymentGatewayResult
{
    public bool Succeeded { get; set; }
    public string? TransactionId { get; set; }
    public string? ProviderReference { get; set; }
    public string? ErrorMessage { get; set; }

    public static PaymentGatewayResult Success(string transactionId, string providerReference) => new()
    {
        Succeeded = true,
        TransactionId = transactionId,
        ProviderReference = providerReference
    };

    public static PaymentGatewayResult Failure(string errorMessage) => new()
    {
        Succeeded = false,
        ErrorMessage = errorMessage
    };
}