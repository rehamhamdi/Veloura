using MediatR;
using Microsoft.EntityFrameworkCore;
using Veloura.Application.Common.Wrappers;
using Veloura.Application.DTOs.Settings;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Application.Commands.Settings.UpdateContactInfo;

public class UpdateContactInfoHandler
    : IRequestHandler<UpdateContactInfoCommand, Response<SiteSettingsDto>>
{
    private readonly IAppDbContext _context;
    private readonly ResponseHandler _responseHandler;

    public UpdateContactInfoHandler(IAppDbContext context, ResponseHandler responseHandler)
    {
        _context = context;
        _responseHandler = responseHandler;
    }

    public async Task<Response<SiteSettingsDto>> Handle(
        UpdateContactInfoCommand request,
        CancellationToken cancellationToken)
    {
        var settings = await _context.SiteSettings
            .OrderBy(s => s.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (settings is null)
        {
            settings = new SiteSettings();
            _context.SiteSettings.Add(settings);
        }

        settings.ContactEmail = request.ContactEmail;
        settings.ContactPhone = request.ContactPhone;
        settings.ContactAddress = request.ContactAddress;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

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

        return _responseHandler.Success(dto, "Contact information updated successfully.");
    }
}