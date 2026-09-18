using FluentValidation;

namespace Veloura.Application.Features.Contact.SendMessage;

public class SendContactMessageValidator
    : AbstractValidator<SendContactMessageCommand>
{
    public SendContactMessageValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(150);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        RuleFor(x => x.Message)
            .NotEmpty();
    }
}