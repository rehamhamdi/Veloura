using FluentValidation;

namespace Veloura.Application.Commands.Orders.Checkout;

public class CheckoutValidator : AbstractValidator<CheckoutCommand>
{
    public CheckoutValidator()
    {
        RuleFor(x => x.ShippingAddressId).GreaterThan(0);
        RuleFor(x => x.PaymentMethod).IsInEnum();
    }
}
