using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Payments;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Payments
{
    public class CreatePaymentHandler
     : IRequestHandler<CreatePaymentCommand, Response<PaymentDto>>
    {
        private readonly IPaymentService _paymentService;
        private readonly IAppDbContext _context;
        private readonly ResponseHandler _responseHandler;

        public CreatePaymentHandler(
            IPaymentService paymentService,
            IAppDbContext context,
            ResponseHandler responseHandler)
        {
            _paymentService = paymentService;
            _context = context;
            _responseHandler = responseHandler;
        }

        public async Task<Response<PaymentDto>> Handle(
            CreatePaymentCommand request,
            CancellationToken cancellationToken)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(
                    o => o.Id == request.OrderId &&
                         o.UserId == request.UserId,
                    cancellationToken);

            if (order == null)
            {
                return _responseHandler.NotFound<PaymentDto>(
                    "Order not found.");
            }

            var payment = await _paymentService.CreatePaymentAsync(
                order.Id,
                order.Total,
                request.PaymentMethod);

            var dto = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                PaymentMethod = payment.PaymentMethod,
                Status = payment.Status,
                Amount = payment.Amount,
                TransactionId = payment.TransactionId,
                ProviderReference = payment.ProviderReference,
                CreatedAt = payment.CreatedAt,
                PaidAt = payment.PaidAt
            };

            return _responseHandler.Created(
                dto,
                "Payment created successfully.");
        }
    }
}
