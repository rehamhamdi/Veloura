using MediatR;
using Veloura.Application.DTOs.Account;

namespace Veloura.Application.Features.Account.UpdateProfile;

public record UpdateProfileCommand(
    int UserId,
    string Name,
    string Email,
    string? CurrentPassword,
    string? NewPassword) : IRequest<UserDto>;