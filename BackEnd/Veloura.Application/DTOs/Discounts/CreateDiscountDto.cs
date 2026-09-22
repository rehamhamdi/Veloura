using System.Text.Json.Serialization;
using Veloura.Application.Common.Converters;
using Veloura.Domain.Enums;


namespace Veloura.Application.DTOs.Discounts;

public class CreateDiscountDto
{
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
}