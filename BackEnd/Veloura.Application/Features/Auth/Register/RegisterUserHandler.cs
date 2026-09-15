using MediatR;
using Veloura.Application.Common.DTOs;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;
using Veloura.Domain.Enums;

namespace Veloura.Application.Features.Auth.Register;

public class RegisterUserHandler : IRequestHandler<RegisterUserCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterUserHandler(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDto> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        if (await _userRepository.EmailExistsAsync(request.Email, cancellationToken))
            throw new EmailAlreadyExistsException(request.Email);

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = UserRole.Buyer,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user, cancellationToken);

        return new UserDto { Id = user.Id, Name = user.Name, Email = user.Email, Role = user.Role.ToString() };
    }
}