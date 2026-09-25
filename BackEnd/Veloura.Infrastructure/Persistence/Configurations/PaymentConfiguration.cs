using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Veloura.Domain.Entities;

namespace Veloura.Infrastructure.Persistence.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Amount)
               .HasColumnType("decimal(18,2)");

        builder.Property(p => p.Status)
               .HasConversion<string>()
               .HasMaxLength(20);

        builder.Property(p => p.PaymentMethod)
               .HasConversion<string>()
               .HasMaxLength(30);

        builder.Property(p => p.TransactionId).HasMaxLength(200);
        builder.Property(p => p.ProviderReference).HasMaxLength(200);
        builder.Property(p => p.FailureReason).HasMaxLength(500);

        builder.HasOne(p => p.Order)
               .WithOne(o => o.Payment)
               .HasForeignKey<Payment>(p => p.OrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(p => p.OrderId).IsUnique();
    }
}