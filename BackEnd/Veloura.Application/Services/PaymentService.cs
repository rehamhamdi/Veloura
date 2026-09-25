using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Domain.Enums;

namespace Veloura.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;

    public PaymentService(IPaymentRepository paymentRepository)
    {
        _paymentRepository = paymentRepository;
    }

    public async Task<Payment> CreatePaymentAsync(
        int orderId,
        decimal amount,
        PaymentMethod paymentMethod)
    {
        var payment = new Payment
        {
            OrderId = orderId,
            Amount = amount,
            PaymentMethod = paymentMethod,
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _paymentRepository.AddAsync(payment, CancellationToken.None);

        return payment;
    }

    public async Task<bool> MarkAsPaidAsync(
        int paymentId,
        string? transactionId = null,
        string? providerReference = null)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId, CancellationToken.None);
        if (payment is null) return false;

        payment.Status = PaymentStatus.Paid;
        payment.TransactionId = transactionId;
        payment.ProviderReference = providerReference;
        payment.PaidAt = DateTime.UtcNow;

        await _paymentRepository.UpdateAsync(payment, CancellationToken.None);
        return true;
    }

    public async Task<bool> MarkAsFailedAsync(int paymentId)
    {
        var payment = await _paymentRepository.GetByIdAsync(paymentId, CancellationToken.None);
        if (payment is null) return false;

        payment.Status = PaymentStatus.Failed;

        await _paymentRepository.UpdateAsync(payment, CancellationToken.None);
        return true;
    }
}