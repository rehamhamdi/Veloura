using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Veloura.Domain.Entities;

namespace Veloura.Infrastructure.Persistence.Configurations;

public class DiscountConfiguration : IEntityTypeConfiguration<Discount>
{
    public void Configure(EntityTypeBuilder<Discount> builder)
    {
        builder.ToTable("Discounts");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Code)
               .IsRequired()
               .HasMaxLength(50);

        builder.HasIndex(d => d.Code)
               .IsUnique();

        builder.Property(d => d.Type)
               .HasConversion<string>()
               .HasMaxLength(20);

        builder.Property(d => d.Value)
               .HasColumnType("decimal(18,2)");

        builder.Property(d => d.MinimumOrderAmount)
               .HasColumnType("decimal(18,2)");

        builder.Property(d => d.UsedCount)
               .IsRequired();

        builder.Property(d => d.IsActive)
               .IsRequired();

        builder.HasCheckConstraint(
            "CK_Discounts_Value_Positive",
            "[Value] > 0");

        builder.HasCheckConstraint(
            "CK_Discounts_MinimumOrderAmount_NonNegative",
            "[MinimumOrderAmount] IS NULL OR [MinimumOrderAmount] >= 0");
    }
}