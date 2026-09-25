using Veloura.Domain.Common;
using Veloura.Domain.Enums;

namespace Veloura.Domain.Entities;

public class Payment : BaseEntity
{
    public int OrderId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; }
    public decimal Amount { get; set; }
    public string? TransactionId { get; set; }
    public string? ProviderReference { get; set; }
    public string? FailureReason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }

    public Order Order { get; set; } = default!;
}