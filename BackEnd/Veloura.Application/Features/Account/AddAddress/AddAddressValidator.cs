using FluentValidation;

namespace Veloura.Application.Features.Account.AddAddress;

public class AddAddressValidator : AbstractValidator<AddAddressCommand>
{
    public AddAddressValidator()
    {
        RuleFor(x => x.Street).NotEmpty();
        RuleFor(x => x.City).NotEmpty();
        RuleFor(x => x.State).NotEmpty();
        RuleFor(x => x.PostalCode).NotEmpty();
        RuleFor(x => x.Country).NotEmpty();
    }
}
