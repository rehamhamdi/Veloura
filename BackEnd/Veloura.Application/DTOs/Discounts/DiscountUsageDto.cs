namespace Veloura.Application.DTOs.Discounts;

public class DiscountUsageDto
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int OrderId { get; set; }
    public DateTime UsedAt { get; set; }
}