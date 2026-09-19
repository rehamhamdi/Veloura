using FluentValidation;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Discounts.CreateDiscount;

public class CreateDiscountValidator : AbstractValidator<CreateDiscountCommand>
{
    public CreateDiscountValidator()
    {
        RuleFor(x => x.Discount.Code)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Discount.Type)
            .IsInEnum();

        RuleFor(x => x.Discount.Value)
            .GreaterThan(0);

        RuleFor(x => x.Discount.Value)
            .LessThanOrEqualTo(100)
            .When(x => x.Discount.Type == DiscountType.Percentage);

        RuleFor(x => x.Discount.MinimumOrderAmount)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Discount.MinimumOrderAmount.HasValue);

        RuleFor(x => x.Discount.ExpiresAt)
            .GreaterThan(x => x.Discount.StartsAt)
            .When(x => x.Discount.ExpiresAt.HasValue);

        RuleFor(x => x.Discount.MaxUses)
            .GreaterThan(0)
            .When(x => x.Discount.MaxUses.HasValue);
    }
}