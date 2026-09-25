using MediatR;
using Veloura.Application.DTOs.Account;

namespace Veloura.Application.Features.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;