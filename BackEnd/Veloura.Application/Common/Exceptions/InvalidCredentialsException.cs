namespace Veloura.Application.Common.Exceptions;

public class InvalidCredentialsException : Exception
{
    public InvalidCredentialsException()
        : base("Invalid email or password.") { }

    public class InvalidOrExpiredOtpException : Exception
    {
        public InvalidOrExpiredOtpException()
            : base("The OTP code is invalid or has expired") { }
    }

    public class TooManyOtpAttemptsException : Exception
    {
        public TooManyOtpAttemptsException()
            : base("Too many incorrect attempts. Please request a new code") { }
    }
}