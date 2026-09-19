using Veloura.Domain.Common;
using Veloura.Domain.Enums;

namespace Veloura.Domain.Entities;

public class Order : BaseEntity
{
    public int UserId { get; set; }
    public int ShippingAddressId { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public OrderStatus Status { get; set; }

    public decimal Subtotal { get; set; }
    public string? DiscountCode { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal Total { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

        public Payment? Payment { get; set; }
        public User User { get; set; } = default!;
        public Address ShippingAddress { get; set; } = default!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
