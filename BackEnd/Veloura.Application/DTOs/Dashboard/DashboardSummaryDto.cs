using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Dashboard
{
    public class DashboardSummaryDto
    {
        public StatCardDto TotalSales { get; set; } = new();
        public StatCardDto TotalOrders { get; set; } = new();
        public StatCardDto TotalProducts { get; set; } = new();
        public StatCardDto TotalCustomers { get; set; } = new();
    }
}
