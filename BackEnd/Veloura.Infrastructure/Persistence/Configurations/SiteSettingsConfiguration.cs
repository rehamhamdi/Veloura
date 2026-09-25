using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Veloura.Domain.Entities;

namespace Veloura.Infrastructure.Persistence.Configurations;

public class SiteSettingsConfiguration : IEntityTypeConfiguration<SiteSettings>
{
    public void Configure(EntityTypeBuilder<SiteSettings> builder)
    {
        builder.ToTable("SiteSettings");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.FacebookUrl).HasMaxLength(300);
        builder.Property(s => s.InstagramUrl).HasMaxLength(300);
        builder.Property(s => s.TwitterUrl).HasMaxLength(300);
        builder.Property(s => s.LinkedInUrl).HasMaxLength(300);
        builder.Property(s => s.YouTubeUrl).HasMaxLength(300);

        builder.Property(s => s.ContactEmail).HasMaxLength(200);
        builder.Property(s => s.ContactPhone).HasMaxLength(50);
        builder.Property(s => s.ContactAddress).HasMaxLength(500);
    }
}