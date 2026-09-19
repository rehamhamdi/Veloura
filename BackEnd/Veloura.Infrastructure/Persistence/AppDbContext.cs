using Microsoft.EntityFrameworkCore;
using System.Reflection;
using Veloura.Application.Interfaces;
using Veloura.Domain.Entities;

namespace Veloura.Infrastructure.Persistence
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Address> Addresses => Set<Address>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
        public DbSet<Discount> Discounts => Set<Discount>();
        public DbSet<DiscountUsage> DiscountUsages => Set<DiscountUsage>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Properties.Any(p => p.Metadata.Name == "CreatedAt") && entry.State == EntityState.Added)
                    entry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;

                if (entry.Properties.Any(p => p.Metadata.Name == "UpdatedAt") &&
                    (entry.State == EntityState.Added || entry.State == EntityState.Modified))
                    entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}