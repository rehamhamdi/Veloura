using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Contact;
using Veloura.Application.Interfaces;

namespace Veloura.Application.Queries.Contact.GetMessages;

public class GetContactMessagesHandler
    : IRequestHandler<GetContactMessagesQuery, Response<List<ContactMessageDto>>>
{
    private readonly IContactMessageRepository _contactMessageRepository;
    private readonly ResponseHandler _responseHandler;

    public GetContactMessagesHandler(
        IContactMessageRepository contactMessageRepository,
        ResponseHandler responseHandler)
    {
        _contactMessageRepository = contactMessageRepository;
        _responseHandler = responseHandler;
    }

    public async Task<Response<List<ContactMessageDto>>> Handle(
        GetContactMessagesQuery request,
        CancellationToken cancellationToken)
    {
        var messages = await _contactMessageRepository.GetAllAsync(
            cancellationToken);

        var result = messages
            .Select(message => new ContactMessageDto
            {
                Id = message.Id,
                Name = message.Name,
                Email = message.Email,
                Message = message.Message,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt
            })
            .ToList();

        return _responseHandler.Success(
            result,
            "Contact messages retrieved successfully.");
    }
}