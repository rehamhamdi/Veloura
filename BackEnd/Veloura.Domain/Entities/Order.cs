using Veloura.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;
using Veloura.Domain.Enums;

namespace Veloura.Domain.Entities
{
    public class Order : BaseEntity
    {
        public int UserId { get; set; }
        public int ShippingAddressId { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public OrderStatus Status { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User User { get; set; } = default!;
        public Address ShippingAddress { get; set; } = default!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
