using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Contact;

namespace Veloura.Application.Commands.Contact.MarkAsRead;

public record MarkContactMessageAsReadCommand(
    int ContactMessageId
) : IRequest<Response<ContactMessageDto>>;