using MediatR;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.DTOs.Account;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Features.Account.UpdateProfile;

public class UpdateProfileHandler : IRequestHandler<UpdateProfileCommand, UserDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UpdateProfileHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserDto> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken)
            ?? throw new NotFoundException(
                nameof(User),
                request.UserId);

        var emailChanged = !string.Equals(
            user.Email,
            request.Email,
            StringComparison.OrdinalIgnoreCase);

        if (emailChanged &&
            await _userRepository.EmailExistsAsync(
                request.Email,
                cancellationToken))
        {
            throw new EmailAlreadyExistsException(request.Email);
        }

        user.Name = request.Name;
        user.Email = request.Email;

        await _userRepository.UpdateAsync(
            user,
            cancellationToken);

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }
}