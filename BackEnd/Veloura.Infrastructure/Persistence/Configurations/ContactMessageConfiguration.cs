using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Veloura.Domain.Entities;

namespace Veloura.Infrastructure.Persistence.Configurations;

public class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
{
    public void Configure(EntityTypeBuilder<ContactMessage> builder)
    {
        builder.ToTable("ContactMessages");
        builder.HasKey(cm => cm.Id);

        builder.Property(cm => cm.Name)
               .IsRequired()
               .HasMaxLength(150);

        builder.Property(cm => cm.Email)
               .IsRequired()
               .HasMaxLength(200);

        builder.Property(cm => cm.Message)
               .IsRequired();

        builder.Property(cm => cm.IsRead)
               .IsRequired()
               .HasDefaultValue(false);
    }
}