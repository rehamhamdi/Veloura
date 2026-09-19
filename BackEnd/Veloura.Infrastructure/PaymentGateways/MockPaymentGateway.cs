using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Domain.Enums;

namespace Veloura.Infrastructure.PaymentGateways
{
    public class MockPaymentGateway : IPaymentGateway
    {
        public Task<PaymentGatewayResult> ProcessPaymentAsync(
            int orderId,
            decimal amount,
            PaymentMethod paymentMethod,
            CancellationToken cancellationToken = default)
        {
            var result = new PaymentGatewayResult
            {
                IsSuccess = true,
                TransactionId = Guid.NewGuid().ToString(),
                ProviderReference = $"MOCK-{orderId}",
                PaymentUrl = null
            };

            return Task.FromResult(result);
        }
    }
}
