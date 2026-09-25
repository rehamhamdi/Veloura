using FluentValidation;

namespace Veloura.Application.Commands.Settings.UpdateContactInfo;

public class UpdateContactInfoValidator : AbstractValidator<UpdateContactInfoCommand>
{
    public UpdateContactInfoValidator()
    {
        RuleFor(x => x.ContactEmail)
            .EmailAddress().WithMessage("Contact email is not valid.")
            .When(x => !string.IsNullOrWhiteSpace(x.ContactEmail));

        RuleFor(x => x.ContactPhone)
            .MaximumLength(50);

        RuleFor(x => x.ContactAddress)
            .MaximumLength(500);
    }
}