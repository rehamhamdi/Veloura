using Microsoft.EntityFrameworkCore;
using Veloura.Domain.Entities;

namespace Veloura.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<User> Users { get; }
    DbSet<Address> Addresses { get; }
    DbSet<Product> Products { get; }
    DbSet<ProductImage> ProductImages { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<WishlistItem> WishlistItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Discount> Discounts { get; }
    DbSet<DiscountUsage> DiscountUsages { get; }

    DbSet<Payment> Payments { get; }
    DbSet<SiteSettings> SiteSettings { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}