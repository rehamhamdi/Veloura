using FluentValidation;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Discounts.UpdateDiscount;

public class UpdateDiscountValidator
    : AbstractValidator<UpdateDiscountCommand>
{
    public UpdateDiscountValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0);

        RuleFor(x => x.Discount.Code)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.Discount.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Discount.Description)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrWhiteSpace(x.Discount.Description));

        RuleFor(x => x.Discount.Type)
            .IsInEnum();

        RuleFor(x => x.Discount.Value)
     .GreaterThanOrEqualTo(0);

        RuleFor(x => x.Discount.Value)
            .GreaterThan(0)
            .When(x => x.Discount.Type != DiscountType.FreeShipping);

        RuleFor(x => x.Discount.Value)
            .LessThanOrEqualTo(100)
            .When(x => x.Discount.Type == DiscountType.Percentage);

        RuleFor(x => x.Discount.MinimumOrderAmount)
            .GreaterThanOrEqualTo(0)
            .When(x => x.Discount.MinimumOrderAmount.HasValue);

        RuleFor(x => x.Discount.AppliesTo)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Discount.ExpiresAt)
            .GreaterThan(x => x.Discount.StartsAt)
            .When(x => x.Discount.ExpiresAt.HasValue);

        RuleFor(x => x.Discount.MaxUses)
            .GreaterThan(0)
            .When(x => x.Discount.MaxUses.HasValue);
    }
}