using FluentValidation;

namespace Veloura.Application.Commands.Discounts.UpdateDiscountStatus;

public class UpdateDiscountStatusValidator
    : AbstractValidator<UpdateDiscountStatusCommand>
{
    public UpdateDiscountStatusValidator()
    {
        RuleFor(x => x.DiscountId)
            .GreaterThan(0);
    }
}