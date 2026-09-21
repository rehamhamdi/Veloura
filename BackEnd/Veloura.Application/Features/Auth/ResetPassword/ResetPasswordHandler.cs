using MediatR;
using Veloura.Application.Common.Exceptions;
using Veloura.Application.Interfaces;
using static Veloura.Application.Common.Exceptions.InvalidCredentialsException;

namespace Veloura.Application.Features.Auth.ResetPassword;

public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand, Unit>
{
    private const int MaxAttempts = 5;

    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public ResetPasswordHandler(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null || user.OtpCodeHash is null || user.OtpExpiresAt is null)
            throw new InvalidOrExpiredOtpException();

        if (user.OtpExpiresAt < DateTime.UtcNow)
            throw new InvalidOrExpiredOtpException();

        if (user.OtpAttempts >= MaxAttempts)
        {
            // Invalidate so they must request a fresh one
            user.OtpCodeHash = null;
            user.OtpExpiresAt = null;
            await _userRepository.UpdateAsync(user, cancellationToken);
            throw new TooManyOtpAttemptsException();
        }

        if (!_passwordHasher.Verify(request.Otp, user.OtpCodeHash))
        {
            user.OtpAttempts++;
            await _userRepository.UpdateAsync(user, cancellationToken);
            throw new InvalidOrExpiredOtpException();
        }

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.OtpCodeHash = null;
        user.OtpExpiresAt = null;
        user.OtpAttempts = 0;

        await _userRepository.UpdateAsync(user, cancellationToken);

        return Unit.Value;
    }
}