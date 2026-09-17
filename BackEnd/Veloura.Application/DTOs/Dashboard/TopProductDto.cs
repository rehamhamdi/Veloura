using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Dashboard
{
    public class TopProductDto
    {
        public int Rank { get; set; }
        public int ProductId { get; set; }
        public string Title { get; set; } = default!;
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public int UnitsSold { get; set; }
        public decimal Revenue { get; set; }
    }
}
