using Veloura.Application.Common.Models;
using Veloura.Domain.Entities;
using Veloura.Domain.Enums;

namespace Veloura.Application.Interfaces
{
    public interface IPaymentGateway
    {
        Task<PaymentGatewayResult> ProcessPaymentAsync(
            int orderId,
            decimal amount,
            PaymentMethod paymentMethod,
            CancellationToken cancellationToken = default);
    }
}