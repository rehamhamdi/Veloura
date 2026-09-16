using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Orders
{
    public class OrderSummaryDto
    {
        public int Id { get; set; }
        public OrderStatus Status { get; set; }
        public decimal Total { get; set; }
        public int ItemsCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
