using FluentValidation;

namespace Veloura.Application.Commands.Discounts.DeleteDiscount;

public class DeleteDiscountValidator
    : AbstractValidator<DeleteDiscountCommand>
{
    public DeleteDiscountValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);
    }
}