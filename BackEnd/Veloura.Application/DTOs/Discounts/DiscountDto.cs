using System.Text.Json.Serialization;
using Veloura.Application.Common.Converters;
using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Discounts;

public class DiscountDto
{
    public int Id { get; set; }

    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    [JsonConverter(typeof(DiscountTypeJsonConverter))]
    public DiscountType Type { get; set; }
    public decimal Value { get; set; }

    public decimal? MinimumOrderAmount { get; set; }
    public string AppliesTo { get; set; } = "All products";

    public DateTime StartsAt { get; set; }
    public DateTime? ExpiresAt { get; set; }

    public int? MaxUses { get; set; }
    public int UsedCount { get; set; }

    public bool IsActive { get; set; }

    public string Status
    {
        get
        {
            var now = DateTime.Now;

            if (!IsActive)
                return "Draft";

            if (StartsAt > now)
                return "Scheduled";

            if (ExpiresAt.HasValue && ExpiresAt.Value <= now)
                return "Expired";

            return "Active";
        }
    }
}