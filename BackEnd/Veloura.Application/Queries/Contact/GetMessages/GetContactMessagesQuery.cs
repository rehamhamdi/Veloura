using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Contact;

namespace Veloura.Application.Queries.Contact.GetMessages;

public record GetContactMessagesQuery
    : IRequest<Response<List<ContactMessageDto>>>;