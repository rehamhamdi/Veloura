using FluentValidation;

namespace Veloura.Application.Commands.Orders.UpdateOrderStatus;

public class UpdateOrderStatusValidator : AbstractValidator<UpdateOrderStatusCommand>
{
    public UpdateOrderStatusValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
        RuleFor(x => x.NewStatus).IsInEnum();
    }
}
