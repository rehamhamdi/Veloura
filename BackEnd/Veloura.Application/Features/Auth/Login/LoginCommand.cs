using MediatR;
using Veloura.Application.Common.DTOs;

namespace Veloura.Application.Features.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponseDto>;