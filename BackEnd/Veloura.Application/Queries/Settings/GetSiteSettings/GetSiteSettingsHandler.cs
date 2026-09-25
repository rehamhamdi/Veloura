using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Settings;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Queries.Settings.GetSiteSettings;

public class GetSiteSettingsHandler
    : IRequestHandler<GetSiteSettingsQuery, Response<SiteSettingsDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public GetSiteSettingsHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<SiteSettingsDto>> Handle(
        GetSiteSettingsQuery request,
        CancellationToken cancellationToken)
    {
        var settings = await _context.SiteSettings
            .OrderBy(s => s.Id)
            .FirstOrDefaultAsync(cancellationToken);

       
        if (settings is null)
        {
            return _responseHandler.Success(new SiteSettingsDto(), "Site settings retrieved successfully.");
        }

        var dto = new SiteSettingsDto
        {
            FacebookUrl = settings.FacebookUrl,
            InstagramUrl = settings.InstagramUrl,
            TwitterUrl = settings.TwitterUrl,
            LinkedInUrl = settings.LinkedInUrl,
            YouTubeUrl = settings.YouTubeUrl,
            ContactEmail = settings.ContactEmail,
            ContactPhone = settings.ContactPhone,
            ContactAddress = settings.ContactAddress,
            UpdatedAt = settings.UpdatedAt
        };

        return _responseHandler.Success(dto, "Site settings retrieved successfully.");
    }
}