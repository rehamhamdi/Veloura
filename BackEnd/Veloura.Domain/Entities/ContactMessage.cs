using Veloura.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Veloura.Domain.Entities
{
    public class ContactMessage : BaseEntity
    {
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Message { get; set; } = default!;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
