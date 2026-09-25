using FluentValidation;
using Veloura.Domain.Enums;

namespace Veloura.Application.Commands.Orders.Checkout;

public class CheckoutValidator : AbstractValidator<CheckoutCommand>
{
    public CheckoutValidator()
    {
        RuleFor(x => x.ShippingAddressId).GreaterThan(0);
        RuleFor(x => x.PaymentMethod).IsInEnum();

        RuleFor(x => x.PaymentToken)
            .NotEmpty()
            .WithMessage("A valid payment method is required.")
            .When(x => x.PaymentMethod != PaymentMethod.CashOnDelivery);
    }
}