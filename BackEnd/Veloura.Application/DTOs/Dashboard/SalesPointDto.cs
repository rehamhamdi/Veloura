using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Dashboard
{
    public class SalesPointDto
    {
        public string Label { get; set; } = default!;
        public decimal Value { get; set; }
    }

}
