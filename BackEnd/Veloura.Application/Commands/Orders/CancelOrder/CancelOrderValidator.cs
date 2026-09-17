using FluentValidation;

namespace Veloura.Application.Commands.Orders.CancelOrder;

public class CancelOrderValidator : AbstractValidator<CancelOrderCommand>
{
    public CancelOrderValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
    }
}
