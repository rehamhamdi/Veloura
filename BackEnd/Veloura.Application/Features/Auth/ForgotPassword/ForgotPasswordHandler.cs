using MediatR;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Features.Auth.ForgotPassword;

public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, Unit>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEmailService _emailService;

    public ForgotPasswordHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IEmailService emailService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _emailService = emailService;
    }

    public async Task<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        // Never reveal whether the email exists
        if (user is null)
            return Unit.Value;

        var otpCode = Random.Shared.Next(100000, 999999).ToString();

        user.OtpCodeHash = _passwordHasher.Hash(otpCode);
        user.OtpExpiresAt = DateTime.UtcNow.AddMinutes(10);
        user.OtpAttempts = 0;

        await _userRepository.UpdateAsync(user, cancellationToken);

        // Send the PLAIN code by email — never the hash
        await _emailService.SendOtpEmailAsync(user.Email, otpCode, cancellationToken);

        return Unit.Value;
    }
}