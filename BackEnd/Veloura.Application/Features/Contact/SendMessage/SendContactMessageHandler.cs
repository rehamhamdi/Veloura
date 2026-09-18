using MediatR;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Features.Contact.SendMessage;

public class SendContactMessageHandler : IRequestHandler<SendContactMessageCommand>
{
    private readonly IContactMessageRepository _contactMessageRepository;

    public SendContactMessageHandler(
        IContactMessageRepository contactMessageRepository)
    {
        _contactMessageRepository = contactMessageRepository;
    }

    public async Task Handle(
        SendContactMessageCommand request,
        CancellationToken cancellationToken)
    {
        var contactMessage = new ContactMessage
        {
            Name = request.Name,
            Email = request.Email,
            Message = request.Message
        };

        await _contactMessageRepository.AddAsync(
            contactMessage,
            cancellationToken);
    }
}