using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Dashboard
{
    public class StatCardDto
    {
        public decimal Value { get; set; }
        public decimal? PercentageChange { get; set; }
    }
}
