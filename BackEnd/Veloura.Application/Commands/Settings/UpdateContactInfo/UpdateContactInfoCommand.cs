using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Settings;

namespace Veloura.Application.Commands.Settings.UpdateContactInfo;

public record UpdateContactInfoCommand(
    string? ContactEmail,
    string? ContactPhone,
    string? ContactAddress
) : IRequest<Response<SiteSettingsDto>>;