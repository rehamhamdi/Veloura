using Microsoft.EntityFrameworkCore;
using Veloura.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace Veloura.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products", t =>
        {
            t.HasCheckConstraint("CK_Products_Price", "[Price] >= 0");
            t.HasCheckConstraint("CK_Products_Stock", "[Stock] >= 0");
        });

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Title).IsRequired().HasMaxLength(250);
        builder.Property(p => p.Price).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(p => p.Stock).IsRequired();
        builder.Property(p => p.Category).HasMaxLength(100);

        builder.HasMany(p => p.Images)
               .WithOne(i => i.Product)
               .HasForeignKey(i => i.ProductId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}