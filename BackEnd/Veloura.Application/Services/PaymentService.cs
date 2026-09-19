using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Domain.Enums;

namespace Veloura.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IAppDbContext _context;
        private readonly IPaymentGateway _paymentGateway;

        public PaymentService(
            IPaymentRepository paymentRepository,
            IAppDbContext context,
            IPaymentGateway paymentGateway)
        {
            _paymentRepository = paymentRepository;
            _context = context;
            _paymentGateway = paymentGateway;
        }

        public async Task<Payment> CreatePaymentAsync(
     int orderId,
     decimal amount,
     PaymentMethod paymentMethod)
        {
            var existingPayment =
                await _paymentRepository.GetByOrderIdAsync(orderId);

            if (existingPayment != null)
                return existingPayment;

            var payment = new Payment
            {
                OrderId = orderId,
                Amount = amount,
                PaymentMethod = paymentMethod,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _paymentRepository.AddAsync(payment);
            await _context.SaveChangesAsync();

            // Cash on Delivery doesn't need a payment gateway
            if (paymentMethod == PaymentMethod.CashOnDelivery)
                return payment;

            var gatewayResult = await _paymentGateway.ProcessPaymentAsync(
                orderId,
                amount,
                paymentMethod);

            if (gatewayResult.IsSuccess)
            {
                payment.Status = PaymentStatus.Paid;
                payment.TransactionId = gatewayResult.TransactionId;
                payment.ProviderReference = gatewayResult.ProviderReference;
                payment.PaidAt = DateTime.UtcNow;
            }
            else
            {
                payment.Status = PaymentStatus.Failed;
            }

            _paymentRepository.Update(payment);
            await _context.SaveChangesAsync();

            return payment;
        }

        public async Task<bool> MarkAsPaidAsync(
            int paymentId,
            string? transactionId = null,
            string? providerReference = null)
        {
            var payment =
                await _paymentRepository.GetByIdAsync(paymentId);

            if (payment == null)
                return false;

            payment.Status = PaymentStatus.Paid;
            payment.TransactionId = transactionId;
            payment.ProviderReference = providerReference;
            payment.PaidAt = DateTime.UtcNow;

            _paymentRepository.Update(payment);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> MarkAsFailedAsync(int paymentId)
        {
            var payment =
                await _paymentRepository.GetByIdAsync(paymentId);

            if (payment == null)
                return false;

            payment.Status = PaymentStatus.Failed;

            _paymentRepository.Update(payment);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
