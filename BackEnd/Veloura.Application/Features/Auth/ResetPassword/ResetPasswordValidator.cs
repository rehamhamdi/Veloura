using FluentValidation;

namespace Veloura.Application.Features.Auth.ResetPassword;

public class ResetPasswordValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();

        RuleFor(x => x.Otp)
            .NotEmpty()
            .Length(6)
            .Matches(@"^\d{6}$")
            .WithMessage("OTP must be a 6-digit code");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .MinimumLength(8);

        RuleFor(x => x.ConfirmPassword)
            .NotEmpty()
            .Equal(x => x.NewPassword)
            .WithMessage("Password and confirmation password must match");
    }
}