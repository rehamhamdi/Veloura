using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Veloura.Application.Commands.Payments;
using Veloura.Domain.Entities;

namespace Veloura.API.Controllers
{

    [ApiController]
    [Route("api/payments")]
    [Authorize(Roles = "Buyer")]
    public class PaymentController : ControllerBase
    {
        private readonly ISender _mediator;

        public PaymentController(ISender mediator)
        {
            _mediator = mediator;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost]
        public async Task<IActionResult> CreatePayment(
            [FromBody] CreatePaymentRequest request,
            CancellationToken cancellationToken)
        {
            var response = await _mediator.Send(
                new CreatePaymentCommand(
                    CurrentUserId,
                    request.OrderId,
                    request.PaymentMethod),
                cancellationToken);

            return StatusCode((int)response.StatusCode, response);
        }
    }

    public record CreatePaymentRequest(
        int OrderId,
        Veloura.Domain.Enums.PaymentMethod PaymentMethod);
}
