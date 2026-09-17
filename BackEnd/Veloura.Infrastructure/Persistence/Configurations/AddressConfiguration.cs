using Veloura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Veloura.Infrastructure.Persistence.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.ToTable("Addresses");
        builder.HasKey(a => a.Id);

        builder.HasOne(a => a.User)
               .WithMany(u => u.Addresses)
               .HasForeignKey(a => a.UserId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}