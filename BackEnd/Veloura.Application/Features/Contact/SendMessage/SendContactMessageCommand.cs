using MediatR;

namespace Veloura.Application.Features.Contact.SendMessage;

public record SendContactMessageCommand(
    string Name,
    string Email,
    string Message) : IRequest;