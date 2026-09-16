using MediatR;
using Veloura.Application.Common.DTOs;

namespace Veloura.Application.Features.Account.UpdateProfile;

public record UpdateProfileCommand(int UserId, string Name, string Email) : IRequest<UserDto>;
