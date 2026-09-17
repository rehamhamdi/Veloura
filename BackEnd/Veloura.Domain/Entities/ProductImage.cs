using Veloura.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Veloura.Domain.Entities
{
    public class ProductImage : BaseEntity
    {
        public int ProductId { get; set; }
        public string Url { get; set; } = default!;
        public int SortOrder { get; set; }

        public Product Product { get; set; } = default!;
    }
}
