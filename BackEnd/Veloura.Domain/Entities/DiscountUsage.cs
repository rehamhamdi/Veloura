using Veloura.Domain.Common;

namespace Veloura.Domain.Entities;

public class DiscountUsage : BaseEntity
{
    public int DiscountId { get; set; }
    public int UserId { get; set; }
    public int OrderId { get; set; }
    public DateTime UsedAt { get; set; }

    public Discount Discount { get; set; } = default!;
    public User User { get; set; } = default!;
    public Order Order { get; set; } = default!;
}