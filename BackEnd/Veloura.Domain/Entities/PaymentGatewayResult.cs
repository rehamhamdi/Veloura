using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Veloura.Domain.Entities
{
    public class PaymentGatewayResult
    {
        public bool IsSuccess { get; set; }

        public string? TransactionId { get; set; }

        public string? ProviderReference { get; set; }

        public string? PaymentUrl { get; set; }

        public string? ErrorMessage { get; set; }
    }
}
