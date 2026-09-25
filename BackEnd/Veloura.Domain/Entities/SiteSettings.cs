using Veloura.Domain.Common;

namespace Veloura.Domain.Entities
{
    public class SiteSettings : BaseEntity
    {
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? YouTubeUrl { get; set; }

        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactAddress { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}