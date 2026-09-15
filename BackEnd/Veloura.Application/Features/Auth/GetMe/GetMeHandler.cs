using MediatR;
using Veloura.Application.Common.DTOs;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Features.Auth.GetMe;

public class GetMeHandler : IRequestHandler<GetMeQuery, UserDto>
{
    private readonly IUserRepository _userRepository;

    public GetMeHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> Handle(GetMeQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        return new UserDto { Id = user.Id, Name = user.Name, Email = user.Email, Role = user.Role.ToString() };
    }
}