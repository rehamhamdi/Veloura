using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Veloura.Domain.Entities;

namespace Veloura.Infrastructure.Persistence.Configurations;

public class DiscountUsageConfiguration : IEntityTypeConfiguration<DiscountUsage>
{
    public void Configure(EntityTypeBuilder<DiscountUsage> builder)
    {
        builder.ToTable("DiscountUsages");

        builder.HasKey(du => du.Id);

        builder.HasIndex(du => new { du.DiscountId, du.UserId })
               .IsUnique();

        builder.HasOne(du => du.Discount)
               .WithMany(d => d.Usages)
               .HasForeignKey(du => du.DiscountId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(du => du.User)
               .WithMany()
               .HasForeignKey(du => du.UserId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(du => du.Order)
               .WithMany()
               .HasForeignKey(du => du.OrderId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}