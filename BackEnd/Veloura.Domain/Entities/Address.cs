using Veloura.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace Veloura.Domain.Entities
{
    public class Address : BaseEntity
    {
        public int UserId { get; set; }
        public string? Label { get; set; }          
        public string Street { get; set; } = default!;
        public string City { get; set; } = default!;
        public string State { get; set; } = default!;
        public string PostalCode { get; set; } = default!;
        public string Country { get; set; } = default!;
        public bool IsDefault { get; set; }

        public User User { get; set; } = default!;
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
