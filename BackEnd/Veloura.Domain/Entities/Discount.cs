using Veloura.Domain.Common;
using Veloura.Domain.Enums;

namespace Veloura.Domain.Entities;

public class Discount : BaseEntity
{
    public string Code { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? Description { get; set; }

    public DiscountType Type { get; set; }
    public decimal Value { get; set; }

    public decimal? MinimumOrderAmount { get; set; }
    public string AppliesTo { get; set; } = "All products";

    public DateTime StartsAt { get; set; }
    public DateTime? ExpiresAt { get; set; }

    public int? MaxUses { get; set; }
    public int UsedCount { get; set; }

    public bool IsActive { get; set; }

    public ICollection<DiscountUsage> Usages { get; set; } = new List<DiscountUsage>();
}