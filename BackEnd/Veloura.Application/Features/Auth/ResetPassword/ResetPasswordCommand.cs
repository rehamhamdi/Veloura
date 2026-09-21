using MediatR;

namespace Veloura.Application.Features.Auth.ResetPassword;

public record ResetPasswordCommand(
    string Email,
    string Otp,
    string NewPassword,
    string ConfirmPassword
) : IRequest<Unit>;