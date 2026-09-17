using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Application.DTOs.Product
{
    public class UpdateProductDto
    {
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public string? Category { get; set; }

        public List<ProductImageDto> Images { get; set; } = new();
    }
}
