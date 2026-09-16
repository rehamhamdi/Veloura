using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Orders
{
    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductTitle { get; set; } = default!;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal => Math.Round(Price * Quantity, 2);
    }
}
