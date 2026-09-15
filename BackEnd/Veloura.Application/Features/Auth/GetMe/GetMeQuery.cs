using MediatR;
using Veloura.Application.Common.DTOs;

namespace Veloura.Application.Features.Auth.GetMe;

public record GetMeQuery(int UserId) : IRequest<UserDto>;