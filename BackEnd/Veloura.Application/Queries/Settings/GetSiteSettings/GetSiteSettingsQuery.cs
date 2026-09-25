using MediatR;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Settings;

namespace Veloura.Application.Queries.Settings.GetSiteSettings;

public record GetSiteSettingsQuery : IRequest<Response<SiteSettingsDto>>;