using MediatR;
using Veloura.Application.Common.DTOs;

namespace Veloura.Application.Features.Auth.Register;

public record RegisterUserCommand(
    string Name,
    string Email,
    string Password,
    string ConfirmPassword
) : IRequest<UserDto>;