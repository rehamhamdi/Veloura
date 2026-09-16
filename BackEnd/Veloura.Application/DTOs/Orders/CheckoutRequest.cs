using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Domain.Enums;

namespace Veloura.Application.DTOs.Orders
{
    public class CheckoutRequest
    {
        public int ShippingAddressId { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
    }
}
