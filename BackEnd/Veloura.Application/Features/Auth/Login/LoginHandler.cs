using MediatR;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.DTOs.Account;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Features.Auth.Login;

public class LoginHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new InvalidCredentialsException();

        return new AuthResponseDto
        {
            Token = _jwtTokenGenerator.GenerateToken(user),
            User = new UserSummaryDto { Id = user.Id, Name = user.Name, Role = user.Role.ToString() }
        };
    }
}