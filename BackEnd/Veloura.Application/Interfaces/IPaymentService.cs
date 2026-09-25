using Veloura.Domain.Entities;
using Veloura.Domain.Enums;

namespace Veloura.Application.Interfaces
{
    public interface IPaymentService
    {
        Task<Payment> CreatePaymentAsync(
            int orderId,
            decimal amount,
            PaymentMethod paymentMethod);

        Task<bool> MarkAsPaidAsync(
            int paymentId,
            string? transactionId = null,
            string? providerReference = null);

        Task<bool> MarkAsFailedAsync(int paymentId);
    }
}