using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Dashboard
{
    public class SalesOverviewDto
    {
        public SalesOverviewPeriod Period { get; set; }
        public List<SalesPointDto> Points { get; set; } = new();
        public decimal TotalRevenue { get; set; }
        public decimal? PercentageChange { get; set; }
    }
}
