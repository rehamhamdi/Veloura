using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Dashboard
{
    public class RecentOrderDto
    {
        public int OrderId { get; set; }
        public string DisplayId => $"#VL-{OrderId}";
        public string CustomerName { get; set; } = default!;
        public string CustomerInitials { get; set; } = default!;
        public DateTime Date { get; set; }
        public decimal Total { get; set; }
        public OrderStatus Status { get; set; }
    }

}
