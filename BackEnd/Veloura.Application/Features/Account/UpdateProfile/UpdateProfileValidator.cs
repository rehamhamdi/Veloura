using FluentValidation;

namespace Veloura.Application.Features.Account.UpdateProfile;

public class UpdateProfileValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.CurrentPassword)
            .NotEmpty()
            .When(x => !string.IsNullOrWhiteSpace(x.NewPassword));

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .MinimumLength(8)
            .When(x => !string.IsNullOrWhiteSpace(x.CurrentPassword));
    }
}