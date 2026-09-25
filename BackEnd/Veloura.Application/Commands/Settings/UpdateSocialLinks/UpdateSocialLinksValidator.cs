using FluentValidation;

namespace Veloura.Application.Commands.Settings.UpdateSocialLinks;

public class UpdateSocialLinksValidator : AbstractValidator<UpdateSocialLinksCommand>
{
    public UpdateSocialLinksValidator()
    {
        RuleFor(x => x.FacebookUrl).Must(BeAValidUrl).WithMessage("Facebook URL is not valid.")
            .When(x => !string.IsNullOrWhiteSpace(x.FacebookUrl));

        RuleFor(x => x.InstagramUrl).Must(BeAValidUrl).WithMessage("Instagram URL is not valid.")
            .When(x => !string.IsNullOrWhiteSpace(x.InstagramUrl));

        RuleFor(x => x.TwitterUrl).Must(BeAValidUrl).WithMessage("Twitter URL is not valid.")
            .When(x => !string.IsNullOrWhiteSpace(x.TwitterUrl));

        RuleFor(x => x.LinkedInUrl).Must(BeAValidUrl).WithMessage("LinkedIn URL is not valid.")
            .When(x => !string.IsNullOrWhiteSpace(x.LinkedInUrl));

        RuleFor(x => x.YouTubeUrl).Must(BeAValidUrl).WithMessage("YouTube URL is not valid.")
            .When(x => !string.IsNullOrWhiteSpace(x.YouTubeUrl));
    }

    private static bool BeAValidUrl(string? url) =>
        Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
        (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
}