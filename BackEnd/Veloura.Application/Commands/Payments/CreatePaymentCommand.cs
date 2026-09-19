using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Payments;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Payments
{
    public record CreatePaymentCommand(
    int UserId,
    int OrderId,
    PaymentMethod PaymentMethod
) : IRequest<Response<PaymentDto>>;
}
