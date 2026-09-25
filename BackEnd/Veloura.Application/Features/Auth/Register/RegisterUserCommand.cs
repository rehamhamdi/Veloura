using MediatR;
using Veloura.Application.DTOs.Account;

namespace Veloura.Application.Features.Auth.Register;

public record RegisterUserCommand(
    string Name,
    string Email,
    string Password,
    string ConfirmPassword
) : IRequest<UserDto>;