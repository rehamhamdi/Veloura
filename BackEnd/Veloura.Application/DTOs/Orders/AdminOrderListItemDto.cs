using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Orders
{
    public class AdminOrderListItemDto
    {
        public int Id { get; set; }
        public string BuyerName { get; set; } = default!;
        public OrderStatus Status { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
