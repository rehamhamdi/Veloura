using MediatR;

namespace Veloura.Application.Features.Account.ChangePassword;

public record ChangePasswordCommand(
    int UserId,
    string CurrentPassword,
    string NewPassword,
    string ConfirmNewPassword) : IRequest<Unit>;