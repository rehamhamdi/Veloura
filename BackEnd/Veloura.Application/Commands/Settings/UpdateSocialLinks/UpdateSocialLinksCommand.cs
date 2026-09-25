using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Settings;

namespace Veloura.Application.Commands.Settings.UpdateSocialLinks;

public record UpdateSocialLinksCommand(
    string? FacebookUrl,
    string? InstagramUrl,
    string? TwitterUrl,
    string? LinkedInUrl,
    string? YouTubeUrl
) : IRequest<Response<SiteSettingsDto>>;