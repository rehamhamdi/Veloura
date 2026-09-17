using Veloura.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Veloura.Domain.Entities
{
    public class WishlistItem : BaseEntity
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public DateTime CreatedAt { get; set; }

        public User User { get; set; } = default!;
        public Product Product { get; set; } = default!;
    }
}
