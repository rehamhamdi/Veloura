using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Contact;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Commands.Contact.MarkAsRead;

public class MarkContactMessageAsReadHandler
    : IRequestHandler<MarkContactMessageAsReadCommand, Response<ContactMessageDto>>
{
    private readonly IContactMessageRepository _contactMessageRepository;
    private readonly ResponseHandler _responseHandler;

    public MarkContactMessageAsReadHandler(
        IContactMessageRepository contactMessageRepository,
        ResponseHandler responseHandler)
    {
        _contactMessageRepository = contactMessageRepository;
        _responseHandler = responseHandler;
    }

    public async Task<Response<ContactMessageDto>> Handle(
        MarkContactMessageAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var message = await _contactMessageRepository.GetByIdAsync(
            request.ContactMessageId,
            cancellationToken);

        if (message is null)
            return _responseHandler.NotFound<ContactMessageDto>(
                "Contact message not found.");

        message.IsRead = true;

        await _contactMessageRepository.UpdateAsync(
            message,
            cancellationToken);

        var dto = new ContactMessageDto
        {
            Id = message.Id,
            Name = message.Name,
            Email = message.Email,
            Message = message.Message,
            IsRead = message.IsRead,
            CreatedAt = message.CreatedAt
        };

        return _responseHandler.Success(
            dto,
            "Contact message marked as read successfully.");
    }
}