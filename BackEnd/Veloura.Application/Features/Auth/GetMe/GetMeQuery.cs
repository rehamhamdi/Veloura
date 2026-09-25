using MediatR;
using Veloura.Application.DTOs.Account;

namespace Veloura.Application.Features.Auth.GetMe;

public record GetMeQuery(int UserId) : IRequest<UserDto>;