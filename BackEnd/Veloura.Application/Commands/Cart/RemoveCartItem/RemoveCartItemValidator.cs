using FluentValidation;

namespace Veloura.Application.Commands.Cart.RemoveCartItem;

public class RemoveCartItemValidator : AbstractValidator<RemoveCartItemCommand>
{
    public RemoveCartItemValidator()
    {
        RuleFor(x => x.CartItemId).GreaterThan(0);
    }
}
