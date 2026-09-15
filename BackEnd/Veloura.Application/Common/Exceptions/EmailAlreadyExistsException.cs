namespace Veloura.Application.Common.Exceptions;

public class EmailAlreadyExistsException : Exception
{
    public EmailAlreadyExistsException(string email)
        : base($"A user with email '{email}' already exists.") { }
}