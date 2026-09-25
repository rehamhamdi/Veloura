using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Payments;

public class PaymentDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; }
    public decimal Amount { get; set; }
    public string? TransactionId { get; set; }
    public string? ProviderReference { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
}